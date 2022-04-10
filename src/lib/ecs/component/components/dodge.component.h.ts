import { Component, Entity } from '@/lib/ecs'
import { calcPercentChanceSuccess } from '@/utils'

export class DodgeComponent implements Component {
  readonly name = 'Dodge'
  readonly tags = []
  dodgeChance: number

  constructor(
    public entity: Entity,
    protected readonly initDodgeChance?: number
  ) {
    this.dodgeChance = initDodgeChance ?? 5
  }

  isDodgeSuccessful(): boolean {
    return calcPercentChanceSuccess(this.dodgeChance)
  }
}
