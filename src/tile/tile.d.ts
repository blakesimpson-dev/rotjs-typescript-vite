import { Glyph } from '@/glyph'

export type Biome = 'Cave' | 'Forest' | undefined

export interface Tile {
  biome?: Biome
  glyph: Glyph
  isCollider: boolean
  isDestructable: boolean
}

export type TileCatalog = Record<string, Tile>
