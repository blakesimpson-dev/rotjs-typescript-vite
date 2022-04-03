import { Tile } from '@/tile'
import { tiles } from '@/main'

export class Map {
  private _tiles: Tile[][] = []
  private _width = 0
  private _height = 0

  constructor(protected tiles: Tile[][]) {
    this._tiles = tiles
    this._width = tiles.length
    this._height = tiles[0].length
  }

  public get Width(): number {
    return this._width
  }

  public get Height(): number {
    return this._height
  }

  public getTile(x: number, y: number): Tile {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
      return tiles.emptyTile
    } else {
      return this._tiles[x][y] || tiles.emptyTile
    }
  }
}
