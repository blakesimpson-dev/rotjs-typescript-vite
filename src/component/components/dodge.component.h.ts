import { Component } from '@/component'
import { Entity } from '@/entity'
import { calcPercentChanceSuccess } from '@/utils'

export class DodgeComponent implements Component {
  name = 'Dodge'
  tags = []
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
