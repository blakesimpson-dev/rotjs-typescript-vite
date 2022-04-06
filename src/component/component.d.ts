import { Entity } from '@/entity'

export interface Component {
  name: string
  entity: Entity | null
}
