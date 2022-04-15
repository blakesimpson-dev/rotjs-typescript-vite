import { Component, Components, Entity, RenderSystem } from '@/lib/aeics'
import { calcPercentChanceSuccess } from '@/utils'

export class AttackComponent implements Component {
  readonly name = 'Attack'
  readonly tags = []
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

      const attackerColor = this.entity.glyph.fgColor
      const targetColor = target.glyph.fgColor

      if (!this.isHitSuccessful()) {
        RenderSystem.instance.messageConsole.addMessage(
          `%c{${attackerColor}}${this.entity.name}%c{white} attacks %c{${targetColor}}${target.name}%c{white}, but the attack misses`
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
          RenderSystem.instance.messageConsole.addMessage(
            `%c{${attackerColor}}${this.entity.name}%c{white} attacks %c{${targetColor}}${target.name}%c{white}, but the %c{${targetColor}}${target.name}%c{white} dodges`
          )
        } else {
          let damage = this.calcDamage(targetDefence?.defenceValue ?? 0)
          if (this.isHitCritical()) {
            damage = this.calcCriticalDamage(damage)
            RenderSystem.instance.messageConsole.addMessage(
              `%c{${attackerColor}}${this.entity.name}%c{white} attacks %c{${targetColor}}${target.name}%c{white} with a critical hit, dealing ${damage} damage`
            )
          } else {
            RenderSystem.instance.messageConsole.addMessage(
              `%c{${attackerColor}}${this.entity.name}%c{white} attacks %c{${targetColor}}${target.name}%c{white}, dealing ${damage} damage`
            )
          }
          targetHealth.recieveAttack(damage)
        }
      }
    }
  }
}
