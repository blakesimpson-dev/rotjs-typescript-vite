import { Vector3 } from '@/lib/common'
import { Glyph } from '@/lib/glyph'

export type TileType =
  | 'Bounds'
  | 'Empty'
  | 'Floor'
  | 'Wall'
  | 'StairsUp'
  | 'StairsDown'

export interface Tile {
  type: TileType
  glyph: Glyph
  position: Vector3
  isCollider: boolean
  isDestructable: boolean
  isTransparent: boolean
}
