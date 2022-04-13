import {
  Color as RotColor,
  Engine as RotEngine,
  FOV as RotFov,
  Scheduler as RotScheduler,
} from 'rot-js'
import DiscreteShadowcasting from 'rot-js/lib/fov/discrete-shadowcasting'

import { Vector3 } from '@/lib/common'
import { DungeonProps } from '@/lib/dungeon'
import { Components, Entity } from '@/lib/ecs'
import { Glyph } from '@/lib/glyph'
import { Tile, Tiles, TileType } from '@/lib/tile'

export class Dungeon {
  readonly tiles: Tile[][][]
  readonly width: number
  readonly height: number
  readonly depth: number
  readonly fov: DiscreteShadowcasting[]
  readonly explored: boolean[][][]
  readonly visibleTiles: Record<string, boolean> = {}
  readonly entities: Record<string, Entity> = {}
  readonly scheduler = new RotScheduler.Simple()
  readonly engine = new RotEngine(this.scheduler)

  constructor(protected readonly props: DungeonProps) {
    this.tiles = props.tiles
    this.depth = props.tiles.length
    this.width = props.tiles[0].length
    this.height = props.tiles[0][0].length

    this.fov = []
    this.setupFov()

    this.explored = new Array<boolean[][]>(this.depth)
    this.setupExplored()
  }

  setupFov(): void {
    for (let z = 0; z < this.depth; z++) {
      this.fov.push(
        new RotFov.DiscreteShadowcasting(
          (x, y) => {
            return this.getTileAt({ x: x, y: y, z: z }).isTransparent
          },
          { topology: 4 }
        )
      )
    }
  }

  getFov(depth: number): DiscreteShadowcasting {
    return this.fov[depth]
  }

  setupExplored(): void {
    for (let z = 0; z < this.depth; z++) {
      this.explored[z] = new Array<boolean[]>(this.width)
      for (let x = 0; x < this.width; x++) {
        this.explored[z][x] = new Array<boolean>(this.height)
        for (let y = 0; y < this.height; y++) {
          this.explored[z][x][y] = false
        }
      }
    }
  }

  setExplored(position: Vector3, state: boolean): void {
    if (
      this.getTileAt({ x: position.x, y: position.y, z: position.z }).type !==
      'Empty'
    ) {
      this.explored[position.z][position.x][position.y] = state
    }
  }

  isExplored(position: Vector3): boolean {
    if (
      this.getTileAt({ x: position.x, y: position.y, z: position.z }).type !==
      'Empty'
    ) {
      return this.explored[position.z][position.x][position.y]
    } else {
      return false
    }
  }

  updateFov(origin: Vector3, range: number): void {
    this.clearFov()
    this.getFov(origin.z).compute(origin.x, origin.y, range, (x, y) => {
      this.visibleTiles[`${x},${y}`] = true
      this.setExplored({ x: x, y: y, z: origin.z }, true)
    })
  }

  clearFov(): void {
    for (const tileKey in this.visibleTiles) {
      delete this.visibleTiles[tileKey]
    }
  }

  getTileTypesInFov(depth: number): TileType[] {
    const tilesInFov: Tile[] = []

    for (const key in this.visibleTiles) {
      tilesInFov.push(
        this.getTileAt({
          x: parseInt(key.split(',')[0]),
          y: parseInt(key.split(',')[1]),
          z: depth,
        })
      )
    }
    return [...new Set(tilesInFov.map((tile) => tile.type))]
  }

  getEntitiesInFov(depth: number): Entity[] {
    const results: Entity[] = []

    for (const key in this.visibleTiles) {
      const entity = this.getEntityAt({
        x: parseInt(key.split(',')[0]),
        y: parseInt(key.split(',')[1]),
        z: depth,
      })
      if (entity) {
        results.push(entity)
      }
    }

    return results
  }

  isEmptyFloorTileAt(position: Vector3): boolean {
    return (
      this.getTileAt({ x: position.x, y: position.y, z: position.z }).type ===
        'Floor' &&
      !this.getEntityAt({ x: position.x, y: position.y, z: position.z })
    )
  }

  getTileAt(position: Vector3): Tile {
    if (
      position.x < 0 ||
      position.x >= this.width ||
      position.y < 0 ||
      position.y >= this.height ||
      position.z < 0 ||
      position.z >= this.depth
    ) {
      // throw new Error(
      //   `getTileAt(x: ${x}, y: ${y}, z: ${z}): Tile requested is out of bounds`
      // )
      return { ...Tiles.Empty }
    } else {
      return (
        this.tiles[position.z][position.x][position.y] || { ...Tiles.Empty }
      )
    }
  }

  getRndFloorTilePos(depth: number): Vector3 {
    let x, y
    do {
      x = Math.floor(Math.random() * this.width)
      y = Math.floor(Math.random() * this.height)
    } while (
      !this.isEmptyFloorTileAt({
        x: x,
        y: y,
        z: depth,
      })
    )
    return { x: x, y: y, z: depth }
  }

  destructTile(position: Vector3): void {
    if (
      this.getTileAt({
        x: position.x,
        y: position.y,
        z: position.z,
      }).isDestructable
    ) {
      this.tiles[position.z][position.x][position.y] = {
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
        position: { x: position.x, y: position.y, z: position.z },
      }
    }
  }

  clampX(x: number): number {
    return x < 0 ? 0 : x > this.width - 1 ? this.width - 1 : x
  }

  clampY(y: number): number {
    return y < 0 ? 0 : y > this.height - 1 ? this.height - 1 : y
  }

  // clampZ(depth: number): number {
  //   return z < 0 ? 0 : z > this.depth - 1 ? this.depth - 1 : z
  // }

  getTilesAlongLine(
    originX: number,
    originY: number,
    destX: number,
    destY: number,
    depth: number
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
      results.push(
        this.getTileAt({
          x: originX,
          y: originY,
          z: depth,
        })
      )
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
    depth: number
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
        depth
      ).forEach((tile) => {
        results.push(tile)
      })

      this.getTilesAlongLine(
        centerX - x,
        centerY - y,
        centerX + x,
        centerY - y,
        depth
      ).forEach((tile) => {
        results.push(tile)
      })

      this.getTilesAlongLine(
        centerX + y,
        centerY + x,
        centerX - y,
        centerY + x,
        depth
      ).forEach((tile) => {
        results.push(tile)
      })

      this.getTilesAlongLine(
        centerX + y,
        centerY - x,
        centerX - y,
        centerY - x,
        depth
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
    depth: number
  ): TileType[] {
    const tilesInRadius = this.getTilesInRadius(centerX, centerY, radius, depth)
    return [...new Set(tilesInRadius.map((tile) => tile.type))]
  }

  // todo determing if indexFor is needed - if so it needs to be changed for z
  // indexFor(tile: Tile) {
  //   return tile.position.y * this.width + tile.position.x
  // }

  addEntity(entity: Entity): void {
    if (!entity.hasComponent(Components.TransformComponent)) {
      throw new Error(
        `addEntity(entity: ${entity}): 
        \nEntity cannot be added to the map without a TransformComponent`
      )
    }

    entity.dungeon = this
    this.updateEntityPosition(entity)

    if (entity.hasComponent(Components.ActorComponent)) {
      this.scheduler.add(entity.getComponent(Components.ActorComponent), true)
    }
  }

  addEntityAtRndFloorTilePos(entity: Entity, depth: number): void {
    if (!entity.hasComponent(Components.TransformComponent)) {
      throw new Error(
        `addEntity(entity: ${entity}): 
        \nEntity cannot be added to the map without a TransformComponent`
      )
    }

    const randomFloorTilePosition = this.getRndFloorTilePos(depth)
    const entityPosition = entity.getComponent(
      Components.TransformComponent
    ).position
    entityPosition.x = randomFloorTilePosition.x
    entityPosition.y = randomFloorTilePosition.y
    entityPosition.z = randomFloorTilePosition.z
    this.addEntity(entity)
  }

  removeEntity(entity: Entity): void {
    const entityPosition = entity.getComponent(
      Components.TransformComponent
    ).position
    const entityKey = `${entityPosition.x},${entityPosition.y},${entityPosition.z}`
    delete this.entities[entityKey]

    if (entity.hasComponent(Components.ActorComponent)) {
      this.scheduler.remove(entity)
    }
  }

  updateEntityPosition(
    entity: Entity,
    oldX?: number,
    oldY?: number,
    oldZ?: number
  ): void {
    if (oldX) {
      const oldEntityKey = `${oldX},${oldY},${oldZ}`
      if (this.entities[oldEntityKey] === entity) {
        delete this.entities[oldEntityKey]
      }
    }
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
        `updateEntityPosition(entity: ${entity},  oldX: ${oldX}, oldY: ${oldY}, oldZ: ${oldZ}): 
        \nEntity position cannot be updated as new position is out of bounds`
      )
    }
    const entityKey = `${entityPosition.x},${entityPosition.y},${entityPosition.z}`
    if (this.entities[entityKey]) {
      throw new Error(
        `updateEntityPosition(entity: ${entity},  oldX: ${oldX}, oldY: ${oldY}, oldZ: ${oldZ}): 
        \nEntity position cannot be updated as new position is occupied by ${this.entities[entityKey]}`
      )
    }
    this.entities[entityKey] = entity
  }

  getEntityAt(position: Vector3): Entity | null {
    return this.entities[`${position.x},${position.y},${position.z}`]
  }

  getEntitiesInRadius(
    centerX: number,
    centerY: number,
    radius: number,
    depth: number
  ): Entity[] {
    const results: Entity[] = []
    const tilesInRadius = this.getTilesInRadius(centerX, centerY, radius, depth)
    tilesInRadius.forEach((tile) => {
      const entity = this.getEntityAt({
        x: tile.position.x,
        y: tile.position.y,
        z: tile.position.z,
      })
      if (entity) {
        results.push(entity)
      }
    })

    return results
  }
}
