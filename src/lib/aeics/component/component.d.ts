import { Entity } from '@/lib/aeics'

export interface Component {
  name: string
  tags: string[]
  entity: Entity | null
}
