import { Position } from '@/common'
import { TransformComponent } from '@/component'
import { Entity } from '@/entity'
import { Glyph } from '@/glyph'

export class PlayerEntity extends Entity {
  constructor() {
    super({
      glyph: new Glyph({ symbol: '@', fgColor: 'cyan' }),
      name: 'Player',
    })

    this.addComponent(new TransformComponent(this, Position.zero()))
  }
}
