import { ComponentFactory } from '@/component'
import { Entity } from '@/entity'
import { Glyph } from '@/glyph'

export class PlayerEntity extends Entity {
  constructor() {
    super({
      glyph: new Glyph({ symbol: '@', fgColor: 'cyan' }),
      name: 'Player',
    })

    this.addComponent(ComponentFactory.instance.createTransformComponent(this))
    this.addComponent(ComponentFactory.instance.createActorComponent(this))
    this.addComponent(ComponentFactory.instance.createHealthComponent(this))
    this.addComponent(ComponentFactory.instance.createAttackComponent(this))
  }
}
