import { Component, Components, Entity, RenderSystem } from '@/lib/aeics'
import { Game } from '@/lib/game'

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
      if (this.entity.name === 'Player') {
        RenderSystem.instance.messageConsole.addMessage(
          `You have died... Press %c{yellow}[Enter]%c{white} to continue`
        )
        Game.instance.currentScene.setFlag('isPlayerDead', true)
        this.entity.getComponent(Components.ActorComponent).act()
        this.entity.dungeon?.removeEntity(this.entity)
      } else {
        RenderSystem.instance.messageConsole.addMessage(
          `${this.entity.name} has died`
        )
        this.entity.dungeon?.removeEntity(this.entity)
      }
    }
  }
}
