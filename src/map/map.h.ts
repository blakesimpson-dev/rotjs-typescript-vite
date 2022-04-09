import { Engine as RotEngine, Scheduler as RotScheduler } from 'rot-js'

import { Position } from '@/common'
import { Components } from '@/component'
import { Entity } from '@/entity'
import { Tile, TileFactory } from '@/tile'

import { MapProps, MapTile } from './map.d'

export class Map {
  readonly mapTiles: MapTile[][]
  readonly width: number
  readonly height: number

  readonly entities: Entity[] = []
  readonly scheduler = new RotScheduler.Simple()
  readonly engine = new RotEngine(this.scheduler)

  constructor(protected readonly props: MapProps) {
    this.mapTiles = props.mapTiles
    this.width = props.mapTiles.length
    this.height = props.mapTiles.length ?? props.mapTiles[0].length
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

    entity.map = this
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

  // getEntitiesInRadius(
  //   centerX: number,
  //   centerY: number,
  //   radius: number
  // ): Entity[] {
  //   let results: Entity[]
  //   let leftX = centerX - radius
  //   let rightX = centerX + radius
  //   let topY = centerY - radius
  //   let bottomY = centerY + radius

  //   return entities
  // }

  isEmptyFloorTileAt(x: number, y: number): boolean {
    return (
      this.getTileAt(x, y).tile === TileFactory.instance.tileCatalog.floor &&
      !this.getFirstEntityAt(x, y)
    )
  }

  // getTileAt(x: number, y: number): Tile {
  //   if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
  //     return TileFactory.instance.tileCatalog.empty
  //   } else {
  //     return this.mapTiles[x][y].tile || TileFactory.instance.tileCatalog.empty
  //   }
  // }

  getTileAt(x: number, y: number): MapTile {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      throw new Error(
        `getTileAt(x: number, y: number): MapTile requested is out of bounds`
      )
    } else {
      return this.mapTiles[x][y]
    }
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
    if (this.getTileAt(x, y).tile.isDestructable) {
      this.mapTiles[x][y].tile = TileFactory.instance.tileCatalog.floor
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
  ): MapTile[] {
    const result: MapTile[] = []

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
      result.push(this.getTileAt(originX, originY))
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
    return result
  }

  getTilesInRadius(
    centerX: number,
    centerY: number,
    radius: number
  ): MapTile[] {
    const result: MapTile[] = []

    const discovered = new Set<number>()

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
        if (this.addToHashSet(discovered, tile)) {
          result.push(tile)
        }
      })

      this.getTilesAlongLine(
        centerX - x,
        centerY - y,
        centerX + x,
        centerY - y
      ).forEach((tile) => {
        if (this.addToHashSet(discovered, tile)) {
          result.push(tile)
        }
      })

      this.getTilesAlongLine(
        centerX + y,
        centerY + x,
        centerX - y,
        centerY + x
      ).forEach((tile) => {
        if (this.addToHashSet(discovered, tile)) {
          result.push(tile)
        }
      })

      this.getTilesAlongLine(
        centerX + y,
        centerY - x,
        centerX - y,
        centerY - x
      ).forEach((tile) => {
        if (this.addToHashSet(discovered, tile)) {
          result.push(tile)
        }
      })

      if (d < 0) {
        d += 2 * x + 1
      } else {
        d += 2 * (x - y) + 1
        y--
      }

      x++
    } while (x <= y)

    return result
  }

  indexFor(tile: MapTile) {
    return tile.pos.y * this.width + tile.pos.x
  }

  private addToHashSet(hashSet: Set<number>, tile: MapTile) {
    return hashSet.add(this.indexFor(tile))
  }
}
