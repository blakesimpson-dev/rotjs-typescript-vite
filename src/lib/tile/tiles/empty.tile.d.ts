import { Position } from '@/lib/common'
import { Glyph } from '@/lib/glyph'
import { Tile } from '@/lib/tile'

export const Empty: Tile = {
  type: 'Empty',
  glyph: new Glyph({
    symbol: Glyph.defaultSymbol,
    fgColor: Glyph.defaultFgColor,
    bgColor: Glyph.defaultBgColor,
  }),
  position: Position.zero(),
  isCollider: false,
  isDestructable: false,
}
