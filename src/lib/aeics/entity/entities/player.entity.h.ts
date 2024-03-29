import { nanoid } from 'nanoid'

import { ComponentFactory, Entity } from '@/lib/aeics'
import { Glyph } from '@/lib/glyph'

export class PlayerEntity extends Entity {
  constructor() {
    super({
      id: nanoid(),
      glyph: new Glyph({ symbol: '@', fgColor: 'cyan' }),
      name: 'Player',
    })

    this.addComponent(ComponentFactory.instance.createTransformComponent(this))
    this.addComponent(ComponentFactory.instance.createActorComponent(this, []))
    this.addComponent(
      ComponentFactory.instance.createInventoryComponent(this, 22)
    )
    this.addComponent(ComponentFactory.instance.createSightComponent(this))
    this.addComponent(ComponentFactory.instance.createHealthComponent(this, 40))
    this.addComponent(ComponentFactory.instance.createAttackComponent(this))
    this.addComponent(ComponentFactory.instance.createDefenceComponent(this, 5))
    this.addComponent(ComponentFactory.instance.createDodgeComponent(this))
  }
}
