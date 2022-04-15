import { Entity } from '@/lib/aeics'

export interface Action {
  name: string
  entity: Entity | null
  performAction: () => void
}
