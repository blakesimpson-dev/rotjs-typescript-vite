import { Component, Entity, RenderSystem } from '@/lib/ecs'

export class HealthComponent implements Component {
  readonly name = 'Health'
  readonly tags = []
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
      RenderSystem.instance.messageConsole.addMessage(
        `${this.entity.name} has died`
      )
      this.entity.tileMap?.removeEntity(this.entity)
    }
  }
}
