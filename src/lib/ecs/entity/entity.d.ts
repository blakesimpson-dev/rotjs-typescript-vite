import { Entity } from '@/lib/ecs'
import { Glyph } from '@/lib/glyph'

export type EntityCatalog = Record<string, Entity>

export interface EntityProps {
  glyph: Glyph
  name: string
}
