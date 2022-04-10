import { Biome, Position } from '@/lib/common'
import { Glyph } from '@/lib/glyph'
import { Tile } from '@/lib/tile'

export const Bounds: Tile = {
  type: 'Bounds',
  glyph: new Glyph({}),
  position: Position.zero(),
  isCollider: true,
  isDestructable: false,
}

setGlyphForBiome(undefined)

export function setGlyphForBiome(biome: Biome): Glyph {
  console.log(`Bounds Tile setGlyphForBiome: ${biome}`)

  switch (biome) {
    case 'Cave':
      Bounds.glyph = new Glyph({
        symbol: '▒',
        fgColor: 'goldenrod',
        bgColor: Glyph.defaultBgColor,
      })
      console.log(Bounds)
      break

    case 'Forest':
      Bounds.glyph = new Glyph({
        symbol: '▒',
        fgColor: 'green',
        bgColor: Glyph.defaultBgColor,
      })
      break

    default:
      Bounds.glyph = new Glyph({
        symbol: '▒',
        fgColor: Glyph.defaultFgColor,
        bgColor: Glyph.defaultBgColor,
      })
      break
  }
}
