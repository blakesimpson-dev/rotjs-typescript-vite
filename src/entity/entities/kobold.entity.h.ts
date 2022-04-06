import { ComponentFactory } from '@/component'
import { Entity } from '@/entity'
import { Glyph } from '@/glyph'

export class KoboldEntity extends Entity {
  constructor() {
    super({
      glyph: new Glyph({ symbol: 'K', fgColor: 'red' }),
      name: 'Kobold',
    })

    this.addComponent(ComponentFactory.instance.createTransform(this))
    this.addComponent(ComponentFactory.instance.createActor(this))
  }
}
