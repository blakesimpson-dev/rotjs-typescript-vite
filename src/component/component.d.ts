import { Entity } from '@/entity'

export interface Component {
  name: string
  tags: string[]
  entity: Entity | null
}
