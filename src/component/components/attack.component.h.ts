import { Component, Components } from '@/component'
import { Entity } from '@/entity'
import { Game } from '@/game'
import { calcPercentChanceSuccess } from '@/utils'

export class AttackComponent implements Component {
  name = 'Attack'
  tags = []
  attackValue: number
  hitChance: number
  criticalChance: number
  criticalMultiplier: number

  constructor(
    public entity: Entity,
    protected readonly initAttackValue?: number,
    protected readonly initHitChance?: number,
    protected readonly initCriticalChance?: number,
    protected readonly initCriticalMultiplier?: number
  ) {
    this.attackValue = initAttackValue ?? 5
    this.hitChance = initHitChance ?? 60
    this.criticalChance = initCriticalChance ?? 10
    this.criticalMultiplier = initCriticalMultiplier ?? 150
  }

  isHitSuccessful(): boolean {
    return calcPercentChanceSuccess(this.hitChance)
  }

  calcDamage(defended: number): number {
    return (
      1 + Math.floor(Math.random() * Math.max(0, this.attackValue - defended))
    )
  }

  isHitCritical(): boolean {
    return calcPercentChanceSuccess(this.criticalChance)
  }

  calcCriticalDamage(damage: number): number {
    return Math.round((damage * this.criticalMultiplier) / 100)
  }

  performAttack(target: Entity): void {
    if (target.hasComponent(Components.HealthComponent)) {
      const targetHealth = target.getComponent(Components.HealthComponent)

      if (!this.isHitSuccessful()) {
        Game.instance.messageLog.addMessage(
          `${this.entity.name} attacks ${target.name}, but the attack misses`
        )
      } else {
        let targetDefence, targetDodge
        if (target.hasComponent(Components.DefenceComponent)) {
          targetDefence = target.getComponent(Components.DefenceComponent)
        }

        if (target.hasComponent(Components.DodgeComponent)) {
          targetDodge = target.getComponent(Components.DodgeComponent)
        }

        if (targetDodge?.isDodgeSuccessful()) {
          Game.instance.messageLog.addMessage(
            `${this.entity.name} attacks ${target.name}, but the ${target.name} dodges`
          )
        } else {
          let damage = this.calcDamage(targetDefence?.defenceValue ?? 0)
          if (this.isHitCritical()) {
            damage = this.calcCriticalDamage(damage)
            Game.instance.messageLog.addMessage(
              `${this.entity.name} attacks ${target.name} with a critical hit, dealing ${damage} damage`
            )
          } else {
            Game.instance.messageLog.addMessage(
              `${this.entity.name} attacks ${target.name}, dealing ${damage} damage`
            )
          }
          targetHealth.recieveAttack(damage)
        }
      }
    }
  }
}
