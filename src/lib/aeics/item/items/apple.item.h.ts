import { nanoid } from 'nanoid'

import { ComponentFactory, Item } from '@/lib/aeics'
import { Glyph } from '@/lib/glyph'

export class AppleItem extends Item {
  constructor() {
    super({
      id: nanoid(),
      glyph: new Glyph({ symbol: '%', fgColor: 'red' }),
      name: 'Apple',
    })

    this.addComponent(ComponentFactory.instance.createPositionComponent(this))
  }
}
