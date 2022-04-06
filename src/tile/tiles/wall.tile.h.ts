import { Glyph } from '@/glyph'
import { Biome, Tile } from '@/tile'

export class WallTile implements Tile {
  readonly glyph: Glyph
  readonly isCollider: boolean
  readonly isDestructable: boolean

  constructor(public biome: Biome) {
    let symbol, fgColor, bgColor
    switch (biome) {
      case 'Cave':
        symbol = '#'
        fgColor = 'goldenrod'
        bgColor = Glyph.defaultBgColor
        break

      case 'Forest':
        symbol = '♣'
        fgColor = 'green'
        bgColor = Glyph.defaultBgColor
        break

      default:
        symbol = '#'
        fgColor = Glyph.defaultFgColor
        bgColor = Glyph.defaultBgColor
        break
    }

    this.glyph = new Glyph({
      symbol: symbol,
      fgColor: fgColor,
      bgColor: bgColor,
    })

    this.isCollider = true
    this.isDestructable = true
  }
}
