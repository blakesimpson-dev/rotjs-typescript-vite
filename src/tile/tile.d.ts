import { Glyph } from '@/glyph'

export type TileCollection = Record<string, Tile>

export interface TileProps {
  glyph: Glyph
  isCollider: boolean
  isDestructable: boolean
}
