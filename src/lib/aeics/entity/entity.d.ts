import { Entity } from '@/lib/aeics'
import { Glyph } from '@/lib/glyph'

export type EntityCatalog = Record<string, Entity>

export interface EntityProps {
  id: string
  glyph: Glyph
  name: string
}
