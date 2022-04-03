import { TileCollection } from './'
import { Tile } from '@/tile'
import { Glyph } from '@/glyph'

export class TileFactory {
  private static _instance: TileFactory

  private _tiles: TileCollection

  constructor() {
    this._tiles = {
      empty: new Tile(new Glyph({})),
      floor: new Tile(new Glyph({ symbol: '.' })),
      wall: new Tile(new Glyph({ symbol: '#' })),
    }
  }

  public get tiles(): TileCollection {
    return this._tiles
  }

  public static get instance(): TileFactory {
    if (!TileFactory._instance) {
      TileFactory._instance = new TileFactory()
    }

    return TileFactory._instance
  }
}
