import { Biome } from '@/lib/common'
import { Glyph } from '@/lib/glyph'
import { Tile } from '@/lib/tile'

export const StairsDown: Tile = {
  type: 'StairsDown',
  glyph: new Glyph({}),
  position: { x: 0, y: 0, z: 0 },
  isCollider: false,
  isDestructable: false,
}

setGlyphForBiome(undefined)

export function setGlyphForBiome(biome: Biome): Glyph {
  console.log(`Wall Tile setGlyphForBiome: ${biome}`)

  switch (biome) {
    case 'Cave':
      StairsDown.glyph = new Glyph({
        symbol: '>',
        fgColor: Glyph.defaultFgColor,
        bgColor: Glyph.defaultBgColor,
      })
      break

    case 'Forest':
      StairsDown.glyph = new Glyph({
        symbol: '>',
        fgColor: Glyph.defaultFgColor,
        bgColor: Glyph.defaultBgColor,
      })
      break

    default:
      StairsDown.glyph = new Glyph({
        symbol: '>',
        fgColor: Glyph.defaultFgColor,
        bgColor: Glyph.defaultBgColor,
      })
      break
  }
}
