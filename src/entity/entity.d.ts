import { Entity } from '@/entity'
import { Glyph } from '@/glyph'

export type EntityCatalog = Record<string, Entity>

export interface EntityProps {
  glyph: Glyph
  name: string
}
