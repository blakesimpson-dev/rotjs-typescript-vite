import { Component, Components } from '@/component'
import { Entity } from '@/entity'

export class AttackComponent implements Component {
  name = 'Attack'
  tags = []
  dmg: number

  constructor(public entity: Entity, protected readonly initDmg?: number) {
    this.dmg = initDmg ?? 1
  }

  dealDamage(target: Entity): void {
    if (target.hasComponent(Components.HealthComponent)) {
      const targetHealth = target.getComponent(Components.HealthComponent)
      console.log(
        `${this.entity.name} deals ${this.dmg} damage to ${target.name}`
      )
      targetHealth.takeDamage(this.dmg)
    }
  }
}
