import { Position } from '@/common'
import { Game } from '@/game'
import { Tile } from '@/tile'

import { MapProps } from './map.d'

export class Map {
  readonly tiles: Tile[][]
  readonly width: number
  readonly height: number

  constructor(protected readonly props: MapProps) {
    this.tiles = props.tiles
    this.width = props.tiles.length
    this.height = props.tiles.length ?? props.tiles[0].length
  }

  getTile(x: number, y: number): Tile {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return Game.instance.tiles.empty
    } else {
      return this.tiles[x][y] || Game.instance.tiles.empty
    }
  }

  getRandomFloorTilePosition(): Position {
    let x, y
    do {
      x = Math.floor(Math.random() * this.width)
      y = Math.floor(Math.random() * this.height)
    } while (this.getTile(x, y) !== Game.instance.tiles.floor)
    return new Position(x, y)
  }

  destructTile(x: number, y: number): void {
    if (this.getTile(x, y).isDestructable) {
      this.tiles[x][y] = Game.instance.tiles.floor
    }
  }
}
