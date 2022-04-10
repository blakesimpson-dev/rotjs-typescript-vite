import {
  Color as RotColor,
  Engine as RotEngine,
  Scheduler as RotScheduler,
} from 'rot-js'

import { Position } from '@/lib/common'
import { Components, Entity } from '@/lib/ecs'
import { Glyph } from '@/lib/glyph'
import { Tile, Tiles, TileType } from '@/lib/tile'
import { TileMapProps } from '@/lib/tilemap'
import { shuffleArray } from '@/utils'

export class TileMap {
  readonly tiles: Tile[][]
  readonly width: number
  readonly height: number
  readonly entities: Entity[] = []
  readonly scheduler = new RotScheduler.Simple()
  readonly engine = new RotEngine(this.scheduler)

  constructor(protected readonly props: TileMapProps) {
    this.tiles = props.tiles
    this.width = props.tiles.length
    this.height = props.tiles.length ?? props.tiles[0].length
  }

  isEmptyFloorTileAt(x: number, y: number): boolean {
    return this.getTileAt(x, y).type === 'Floor' && !this.getFirstEntityAt(x, y)
  }

  getTileAt(x: number, y: number): Tile {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      throw new Error(
        `getTileAt(x: number, y: number): Tile requested is out of bounds`
      )
    } else {
      return this.tiles[x][y]
    }
  }

  getNeighbouringTiles(x: number, y: number): Tile[] {
    const results: Tile[] = []
    for (let dx = -1; dx < 2; dx++) {
      for (let dy = -1; dy < 2; dy++) {
        if (dx === 0 && dy === 0) {
          continue
        }
        results.push(this.getTileAt(x + dx, y + dy))
      }
    }
    return shuffleArray(results)
  }

  getRndFloorTilePos(): Position {
    let x, y
    do {
      x = Math.floor(Math.random() * this.width)
      y = Math.floor(Math.random() * this.height)
    } while (!this.isEmptyFloorTileAt(x, y))
    return new Position(x, y)
  }

  destructTile(x: number, y: number): void {
    if (this.getTileAt(x, y).isDestructable) {
      this.tiles[x][y] = {
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
        position: new Position(x, y),
      }
    }
  }

  clampX(x: number): number {
    return x < 0 ? 0 : x > this.width - 1 ? this.width - 1 : x
  }

  clampY(y: number): number {
    return y < 0 ? 0 : y > this.height - 1 ? this.height - 1 : y
  }

  getTilesAlongLine(
    originX: number,
    originY: number,
    destX: number,
    destY: number
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
      results.push(this.getTileAt(originX, originY))
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

  getTilesInRadius(centerX: number, centerY: number, radius: number): Tile[] {
    const results: Tile[] = []

    let d = (5 - radius * 4) / 4
    let x = 0
    let y = radius

    do {
      this.getTilesAlongLine(
        centerX + x,
        centerY + y,
        centerX - x,
        centerY + y
      ).forEach((tile) => {
        results.push(tile)
      })

      this.getTilesAlongLine(
        centerX - x,
        centerY - y,
        centerX + x,
        centerY - y
      ).forEach((tile) => {
        results.push(tile)
      })

      this.getTilesAlongLine(
        centerX + y,
        centerY + x,
        centerX - y,
        centerY + x
      ).forEach((tile) => {
        results.push(tile)
      })

      this.getTilesAlongLine(
        centerX + y,
        centerY - x,
        centerX - y,
        centerY - x
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
    radius: number
  ): TileType[] {
    const tilesInRadius = this.getTilesInRadius(centerX, centerY, radius)
    return [...new Set(tilesInRadius.map((tile) => tile.type))]
  }

  indexFor(tile: Tile) {
    return tile.position.y * this.width + tile.position.x
  }

  addEntity(entity: Entity): void {
    if (!entity.hasComponent(Components.TransformComponent)) {
      throw new Error(
        `addEntity(entity: Entity): Entity cannot be added to the map without a TransformComponent`
      )
    } else {
      const entityPosition = entity.getComponent(
        Components.TransformComponent
      ).position
      if (
        entityPosition.x < 0 ||
        entityPosition.x >= this.width ||
        entityPosition.y < 0 ||
        entityPosition.y >= this.height
      ) {
        throw new Error(
          `addEntity(entity: Entity): entity.Transformcomponent.position is out of bounds`
        )
      }
    }

    entity.tileMap = this
    this.entities.push(entity)
    if (entity.hasComponent(Components.ActorComponent)) {
      this.scheduler.add(entity.getComponent(Components.ActorComponent), true)
    }
  }

  addEntityAtRndFloorTilePos(entity: Entity): void {
    if (!entity.hasComponent(Components.TransformComponent)) {
      throw new Error(
        `addEntity(entity: Entity): Entity cannot be added to the map without a TransformComponent`
      )
    }

    const randomFloorTilePosition = this.getRndFloorTilePos()
    const entityPosition = entity.getComponent(
      Components.TransformComponent
    ).position
    entityPosition.x = randomFloorTilePosition.x
    entityPosition.y = randomFloorTilePosition.y
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

  getFirstEntityAt(x: number, y: number): Entity | null {
    return this.entities.filter((entity: Entity) => {
      const entityPosition = entity.getComponent(
        Components.TransformComponent
      ).position
      return entityPosition?.x === x && entityPosition?.y === y
    })[0]
  }

  getEntitiesAt(x: number, y: number): Entity[] {
    return this.entities.filter((entity: Entity) => {
      const entityPosition = entity.hasComponent(Components.TransformComponent)
        ? entity.getComponent(Components.TransformComponent).position
        : null
      return entityPosition
        ? entityPosition.x === x && entityPosition.y === y
        : null
    })
  }

  getEntitiesInRadius(
    centerX: number,
    centerY: number,
    radius: number
  ): Entity[] {
    const results: Entity[] = []
    const tilesInRadius = this.getTilesInRadius(centerX, centerY, radius)
    tilesInRadius.forEach((tile) => {
      results.push(...this.getEntitiesAt(tile.position.x, tile.position.y))
    })

    return results
  }
}
