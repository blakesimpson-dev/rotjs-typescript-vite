import { Component } from '@/component'
import { Entity } from '@/entity'

export class HealthComponent implements Component {
  name = 'Health'
  tags = []
  maxHp: number
  currentHp: number

  constructor(public entity: Entity, protected readonly initHp?: number) {
    this.maxHp = initHp ?? 1
    this.currentHp = this.maxHp
  }

  takeDamage(damage: number): void {
    this.currentHp -= damage
    if (this.currentHp <= 0) {
      console.log(`${this.entity.name} has died`)
      this.entity.map?.removeEntity(this.entity)
    }
  }
}
