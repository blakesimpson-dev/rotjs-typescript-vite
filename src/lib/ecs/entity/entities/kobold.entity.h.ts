import { ComponentFactory, Entity } from '@/lib/ecs'
import { Glyph } from '@/lib/glyph'

export class KoboldEntity extends Entity {
  constructor() {
    super({
      glyph: new Glyph({ symbol: 'K', fgColor: 'red' }),
      name: 'Kobold',
    })

    this.addComponent(ComponentFactory.instance.createTransformComponent(this))
    this.addComponent(ComponentFactory.instance.createActorComponent(this))
    this.addComponent(ComponentFactory.instance.createHealthComponent(this, 25))
    this.addComponent(ComponentFactory.instance.createAttackComponent(this))
    this.addComponent(ComponentFactory.instance.createDefenceComponent(this, 2))
    this.addComponent(ComponentFactory.instance.createDodgeComponent(this))
  }
}
