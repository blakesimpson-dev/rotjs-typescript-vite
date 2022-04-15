import { nanoid } from 'nanoid'

import { Actions, ComponentFactory, Entity } from '@/lib/aeics'
import { Glyph } from '@/lib/glyph'

export class KoboldEntity extends Entity {
  constructor() {
    super({
      id: nanoid(),
      glyph: new Glyph({ symbol: 'K', fgColor: 'pink' }),
      name: 'Kobold',
    })

    this.addComponent(ComponentFactory.instance.createTransformComponent(this))
    this.addComponent(
      ComponentFactory.instance.createActorComponent(this, [
        new Actions.WanderAction(this),
      ])
    )
    this.addComponent(ComponentFactory.instance.createSightComponent(this))
    this.addComponent(ComponentFactory.instance.createHealthComponent(this, 25))
    this.addComponent(ComponentFactory.instance.createAttackComponent(this))
    this.addComponent(ComponentFactory.instance.createDefenceComponent(this, 2))
    this.addComponent(ComponentFactory.instance.createDodgeComponent(this))
  }
}
