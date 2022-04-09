import { Component } from '@/component'
import { Entity } from '@/entity'
import { Game } from '@/game'

export class HealthComponent implements Component {
  name = 'Health'
  tags = []
  maxHpValue: number
  hpValue: number

  constructor(
    public entity: Entity,
    protected readonly initMaxHpValue?: number
  ) {
    this.maxHpValue = initMaxHpValue ?? 20
    this.hpValue = this.maxHpValue
  }

  recieveAttack(attackValue: number): void {
    this.hpValue -= attackValue
    if (this.hpValue <= 0) {
      Game.instance.messageLog.addMessage(`${this.entity.name} has died`)
      this.entity.map?.removeEntity(this.entity)
    }
  }
}
