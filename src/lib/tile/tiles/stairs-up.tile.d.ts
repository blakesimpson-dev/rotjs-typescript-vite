import { Biome, Position } from '@/lib/common'
import { Glyph } from '@/lib/glyph'
import { Tile } from '@/lib/tile'

export const StairsUp: Tile = {
  type: 'StairsUp',
  glyph: new Glyph({}),
  position: Position.zero(),
  isCollider: false,
  isDestructable: false,
}

setGlyphForBiome(undefined)

export function setGlyphForBiome(biome: Biome): Glyph {
  console.log(`Wall Tile setGlyphForBiome: ${biome}`)

  switch (biome) {
    case 'Cave':
      StairsUp.glyph = new Glyph({
        symbol: '<',
        fgColor: Glyph.defaultFgColor,
        bgColor: Glyph.defaultBgColor,
      })
      break

    case 'Forest':
      StairsUp.glyph = new Glyph({
        symbol: '<',
        fgColor: Glyph.defaultFgColor,
        bgColor: Glyph.defaultBgColor,
      })
      break

    default:
      StairsUp.glyph = new Glyph({
        symbol: '#<',
        fgColor: Glyph.defaultFgColor,
        bgColor: Glyph.defaultBgColor,
      })
      break
  }
}
