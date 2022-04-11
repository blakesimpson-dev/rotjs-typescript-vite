import { Biome } from '@/lib/common'
import { Glyph } from '@/lib/glyph'
import { Tile } from '@/lib/tile'

export const Wall: Tile = {
  type: 'Wall',
  glyph: new Glyph({}),
  position: { x: 0, y: 0, z: 0 },
  isCollider: true,
  isDestructable: true,
}

setGlyphForBiome(undefined)

export function setGlyphForBiome(biome: Biome): Glyph {
  console.log(`Wall Tile setGlyphForBiome: ${biome}`)

  switch (biome) {
    case 'Cave':
      Wall.glyph = new Glyph({
        symbol: '#',
        fgColor: 'goldenrod',
        bgColor: Glyph.defaultBgColor,
      })
      break

    case 'Forest':
      Wall.glyph = new Glyph({
        symbol: '♠',
        fgColor: 'green',
        bgColor: Glyph.defaultBgColor,
      })
      break

    default:
      Wall.glyph = new Glyph({
        symbol: '#',
        fgColor: Glyph.defaultFgColor,
        bgColor: Glyph.defaultBgColor,
      })
      break
  }
}
