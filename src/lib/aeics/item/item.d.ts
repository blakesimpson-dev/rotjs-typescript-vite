import { Item } from '@/lib/aeics'
import { Glyph } from '@/lib/glyph'

export type ItemCatalog = Record<string, Item>

export interface ItemProps {
  id: string
  glyph: Glyph
  name: string
}
