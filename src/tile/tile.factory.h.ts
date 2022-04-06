import { Glyph } from '@/glyph'
import { Tile, TileCollection } from '@/tile'

export class TileFactory {
  private static _instance: TileFactory
  readonly tiles: TileCollection

  constructor() {
    this.tiles = {
      empty: new Tile({
        glyph: new Glyph({}),
        isCollider: false,
        isDestructable: false,
      }),
      floor: new Tile({
        glyph: new Glyph({ symbol: '.' }),
        isCollider: false,
        isDestructable: false,
      }),
      wall: new Tile({
        glyph: new Glyph({ symbol: '#', fgColor: 'goldenrod' }),
        isCollider: true,
        isDestructable: true,
      }),
    }
  }

  static get instance(): TileFactory {
    if (!TileFactory._instance) {
      TileFactory._instance = new TileFactory()
    }

    return TileFactory._instance
  }
}
