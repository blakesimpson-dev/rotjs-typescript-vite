import { Biome, Position } from '@/lib/common'
import { Glyph } from '@/lib/glyph'
import { Tile } from '@/lib/tile'

export const Floor: Tile = {
  type: 'Floor',
  glyph: new Glyph({}),
  position: Position.zero(),
  isCollider: false,
  isDestructable: false,
}

setGlyphForBiome(undefined)

export function setGlyphForBiome(biome: Biome): Glyph {
  console.log(`Floor Tile setGlyphForBiome: ${biome}`)

  switch (biome) {
    case 'Cave':
      Floor.glyph = new Glyph({
        symbol: '.',
        fgColor: 'goldenrod',
        bgColor: Glyph.defaultBgColor,
      })
      break

    case 'Forest':
      Floor.glyph = new Glyph({
        symbol: '.',
        fgColor: 'green',
        bgColor: Glyph.defaultBgColor,
      })
      break

    default:
      Floor.glyph = new Glyph({
        symbol: '.',
        fgColor: Glyph.defaultFgColor,
        bgColor: Glyph.defaultBgColor,
      })
      break
  }
}
