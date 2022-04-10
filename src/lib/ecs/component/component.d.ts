import { Entity } from '@/lib/ecs'

export interface Component {
  name: string
  tags: string[]
  entity: Entity | null
}
