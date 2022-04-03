import { Game } from '@/game'
import { Tile } from '@/tile'

export class Map {
  private _tiles: Tile[][]
  private _width: number
  private _height: number

  constructor(protected tiles: Tile[][]) {
    this._tiles = tiles
    this._width = tiles.length
    this._height = tiles.length ?? tiles[0].length
  }

  public get width(): number {
    return this._width
  }

  public get height(): number {
    return this._height
  }

  public getTile(x: number, y: number): Tile {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
      return Game.instance.tiles.empty
    } else {
      return this._tiles[x][y] || Game.instance.tiles.empty
    }
  }
}
