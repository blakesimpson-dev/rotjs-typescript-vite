import { Glyph } from '@/lib/glyph'
import { Tile } from '@/lib/tile'

export const Empty: Tile = {
  type: 'Empty',
  glyph: new Glyph({
    symbol: Glyph.defaultSymbol,
    fgColor: Glyph.defaultFgColor,
    bgColor: Glyph.defaultBgColor,
  }),
  position: { x: 0, y: 0, z: 0 },
  isCollider: false,
  isDestructable: false,
  isTransparent: true,
}
