import { Glyph } from '@/glyph'
import { Tile } from '@/tile'

export class EmptyTile implements Tile {
  readonly glyph: Glyph
  readonly isCollider: boolean
  readonly isDestructable: boolean

  constructor() {
    this.glyph = new Glyph({
      symbol: Glyph.defaultSymbol,
      fgColor: Glyph.defaultFgColor,
      bgColor: Glyph.defaultBgColor,
    })

    this.isCollider = false
    this.isDestructable = false
  }
}
