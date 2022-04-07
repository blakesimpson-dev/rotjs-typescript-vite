import { Engine as RotEngine, Scheduler as RotScheduler } from 'rot-js'

import { Position } from '@/common'
import { Components } from '@/component'
import { Entity } from '@/entity'
import { Tile, TileFactory } from '@/tile'

import { MapProps } from './map.d'

export class Map {
  readonly tiles: Tile[][]
  readonly width: number
  readonly height: number

  readonly entities: Entity[] = []
  readonly scheduler = new RotScheduler.Simple()
  readonly engine = new RotEngine(this.scheduler)

  constructor(protected readonly props: MapProps) {
    this.tiles = props.tiles
    this.width = props.tiles.length
    this.height = props.tiles.length ?? props.tiles[0].length
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

  isEmptyFloorTileAt(x: number, y: number): boolean {
    return (
      this.getTileAt(x, y) === TileFactory.instance.tileCatalog.floor &&
      !this.getFirstEntityAt(x, y)
    )
  }

  getTileAt(x: number, y: number): Tile {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return TileFactory.instance.tileCatalog.empty
    } else {
      return this.tiles[x][y] || TileFactory.instance.tileCatalog.empty
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
    if (this.getTileAt(x, y).isDestructable) {
      this.tiles[x][y] = TileFactory.instance.tileCatalog.floor
    }
  }
}
