import {
  Color as RotColor,
  Engine as RotEngine,
  Scheduler as RotScheduler,
} from 'rot-js'

import { Vector3 } from '@/lib/common'
import { DungeonProps } from '@/lib/dungeon'
import { Components, Entity, EntityFactory } from '@/lib/ecs'
import { Game } from '@/lib/game'
import { Glyph } from '@/lib/glyph'
import { Tile, Tiles, TileType } from '@/lib/tile'

export class Dungeon {
  readonly tiles: Tile[][][]
  readonly width: number
  readonly height: number
  readonly depth: number
  readonly entities: Entity[] = []
  readonly scheduler = new RotScheduler.Simple()
  readonly engine = new RotEngine(this.scheduler)

  constructor(protected readonly props: DungeonProps) {
    this.tiles = props.tiles
    this.depth = props.tiles.length
    this.width = props.tiles[0].length
    this.height = props.tiles[0][0].length

    this.addEntityAtRndFloorTilePos(Game.instance.player, 0)

    for (let z = 0; z < this.depth; z++) {
      for (let i = 0; i < 20; i++) {
        this.addEntityAtRndFloorTilePos(
          EntityFactory.instance.createKoboldEntity(),
          z
        )
      }
    }
  }

  isEmptyFloorTileAt(x: number, y: number, z: number): boolean {
    return (
      this.getTileAt(x, y, z).type === 'Floor' &&
      !this.getFirstEntityAt(x, y, z)
    )
  }

  getTileAt(x: number, y: number, z: number): Tile {
    if (
      x < 0 ||
      x >= this.width ||
      y < 0 ||
      y >= this.height ||
      z < 0 ||
      z >= this.depth
    ) {
      throw new Error(
        `getTileAt(x: ${x}, y: ${y}, z: ${z}): Tile requested is out of bounds`
      )
    } else {
      return this.tiles[z][x][y] || { ...Tiles.Empty }
    }
  }

  getRndFloorTilePos(z: number): Vector3 {
    let x, y
    do {
      x = Math.floor(Math.random() * this.width)
      y = Math.floor(Math.random() * this.height)
    } while (!this.isEmptyFloorTileAt(x, y, z))
    return { x: x, y: y, z: z }
  }

  destructTile(x: number, y: number, z: number): void {
    if (this.getTileAt(x, y, z).isDestructable) {
      this.tiles[z][x][y] = {
        ...Tiles.Floor,
        glyph: new Glyph({
          ...Tiles.Floor.glyph,
          fgColor: RotColor.toHex(
            RotColor.randomize(
              RotColor.fromString(Tiles.Floor.glyph.fgColor),
              [15, 15, 15]
            )
          ),
        }),
        position: { x: x, y: y, z: z },
      }
    }
  }

  clampX(x: number): number {
    return x < 0 ? 0 : x > this.width - 1 ? this.width - 1 : x
  }

  clampY(y: number): number {
    return y < 0 ? 0 : y > this.height - 1 ? this.height - 1 : y
  }

  // clampZ(z: number): number {
  //   return z < 0 ? 0 : z > this.depth - 1 ? this.depth - 1 : z
  // }

  getTilesAlongLine(
    originX: number,
    originY: number,
    destX: number,
    destY: number,
    z: number
  ): Tile[] {
    const results: Tile[] = []

    originX = this.clampX(originX)
    originY = this.clampY(originY)
    destX = this.clampX(destX)
    destY = this.clampY(destY)

    const dx = Math.abs(destX - originX)
    const dy = Math.abs(destY - originY)

    const sx = originX < destX ? 1 : -1
    const sy = originY < destY ? 1 : -1
    let err = dx - dy

    while (true) {
      results.push(this.getTileAt(originX, originY, z))
      if (originX === destX && originY === destY) {
        break
      }
      const e2 = 2 * err
      if (e2 > -dy) {
        err = err - dy
        originX = originX + sx
      }
      if (e2 < dx) {
        err = err + dx
        originY = originY + sy
      }
    }
    return results
  }

  getTilesInRadius(
    centerX: number,
    centerY: number,
    radius: number,
    z: number
  ): Tile[] {
    const results: Tile[] = []

    let d = (5 - radius * 4) / 4
    let x = 0
    let y = radius

    do {
      this.getTilesAlongLine(
        centerX + x,
        centerY + y,
        centerX - x,
        centerY + y,
        z
      ).forEach((tile) => {
        results.push(tile)
      })

      this.getTilesAlongLine(
        centerX - x,
        centerY - y,
        centerX + x,
        centerY - y,
        z
      ).forEach((tile) => {
        results.push(tile)
      })

      this.getTilesAlongLine(
        centerX + y,
        centerY + x,
        centerX - y,
        centerY + x,
        z
      ).forEach((tile) => {
        results.push(tile)
      })

      this.getTilesAlongLine(
        centerX + y,
        centerY - x,
        centerX - y,
        centerY - x,
        z
      ).forEach((tile) => {
        results.push(tile)
      })

      if (d < 0) {
        d += 2 * x + 1
      } else {
        d += 2 * (x - y) + 1
        y--
      }

      x++
    } while (x <= y)

    return [
      ...new Map(results.map((tile: Tile) => [tile.position, tile])).values(),
    ]
  }

  getTileTypesInRadius(
    centerX: number,
    centerY: number,
    radius: number,
    z: number
  ): TileType[] {
    const tilesInRadius = this.getTilesInRadius(centerX, centerY, radius, z)
    return [...new Set(tilesInRadius.map((tile) => tile.type))]
  }

  // todo determing if indexFor is needed - if so it needs to be changed for z
  // indexFor(tile: Tile) {
  //   return tile.position.y * this.width + tile.position.x
  // }

  addEntity(entity: Entity): void {
    if (!entity.hasComponent(Components.TransformComponent)) {
      throw new Error(
        `addEntity(entity: ${entity}): Entity cannot be added to the map without a TransformComponent`
      )
    } else {
      const entityPosition = entity.getComponent(
        Components.TransformComponent
      ).position
      if (
        entityPosition.x < 0 ||
        entityPosition.x >= this.width ||
        entityPosition.y < 0 ||
        entityPosition.y >= this.height ||
        entityPosition.z < 0 ||
        entityPosition.z >= this.depth
      ) {
        throw new Error(
          `addEntity(entity: ${entity}): entity.Transformcomponent.position is out of bounds`
        )
      }
    }

    entity.dungeon = this
    this.entities.push(entity)
    if (entity.hasComponent(Components.ActorComponent)) {
      this.scheduler.add(entity.getComponent(Components.ActorComponent), true)
    }
  }

  addEntityAtRndFloorTilePos(entity: Entity, z: number): void {
    if (!entity.hasComponent(Components.TransformComponent)) {
      throw new Error(
        `addEntity(entity: Entity): Entity cannot be added to the map without a TransformComponent`
      )
    }

    const randomFloorTilePosition = this.getRndFloorTilePos(z)
    const entityPosition = entity.getComponent(
      Components.TransformComponent
    ).position
    entityPosition.x = randomFloorTilePosition.x
    entityPosition.y = randomFloorTilePosition.y
    entityPosition.z = randomFloorTilePosition.z
    this.addEntity(entity)
  }

  removeEntity(entity: Entity): void {
    const entityIndex = this.entities.indexOf(entity)
    if (entityIndex === -1) {
      throw new Error(
        `removeEntity(entity: Entity): Entity cannot be removed as it does not exist in entities: Entity[]`
      )
    }
    this.entities.splice(entityIndex, 1)
    if (entity.hasComponent(Components.ActorComponent)) {
      this.scheduler.remove(entity)
    }
  }

  getFirstEntityAt(x: number, y: number, z: number): Entity | null {
    return this.entities.filter((entity: Entity) => {
      const entityPosition = entity.getComponent(
        Components.TransformComponent
      ).position
      return (
        entityPosition?.x === x &&
        entityPosition?.y === y &&
        entityPosition?.z === z
      )
    })[0]
  }

  getEntitiesAt(x: number, y: number, z: number): Entity[] {
    return this.entities.filter((entity: Entity) => {
      const entityPosition = entity.hasComponent(Components.TransformComponent)
        ? entity.getComponent(Components.TransformComponent).position
        : null
      return entityPosition
        ? entityPosition.x === x &&
            entityPosition.y === y &&
            entityPosition.z === z
        : null
    })
  }

  getEntitiesInRadius(
    centerX: number,
    centerY: number,
    radius: number,
    z: number
  ): Entity[] {
    const results: Entity[] = []
    const tilesInRadius = this.getTilesInRadius(centerX, centerY, radius, z)
    tilesInRadius.forEach((tile) => {
      results.push(
        ...this.getEntitiesAt(tile.position.x, tile.position.y, tile.position.z)
      )
    })

    return results
  }
}
