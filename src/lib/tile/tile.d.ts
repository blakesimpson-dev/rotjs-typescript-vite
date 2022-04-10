import { Position } from '@/lib/common'
import { Glyph } from '@/lib/glyph'

export type TileType = 'Bounds' | 'Empty' | 'Floor' | 'Wall'

export interface Tile {
  type: TileType
  glyph: Glyph
  position: Position
  isCollider: boolean
  isDestructable: boolean
}
