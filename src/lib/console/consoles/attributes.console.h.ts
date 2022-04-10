import { Display as RotDisplay } from 'rot-js'

import { AttributesConsoleDispOpt } from '@/display.config'
import { Console } from '@/lib/console'
import { Components } from '@/lib/ecs'
import { Game } from '@/lib/game'
import { drawRect } from '@/utils'

export class AttributesConsole implements Console {
  readonly display: RotDisplay
  readonly container: HTMLElement | null

  constructor() {
    this.display = new RotDisplay(AttributesConsoleDispOpt)
    this.container = this.display.getContainer()
  }

  render(): void {
    const playerHealth = Game.instance.player.getComponent(
      Components.HealthComponent
    )
    const playerMaxHp = playerHealth.maxHpValue
    const playerHp = playerHealth.hpValue
    this.display.drawText(1, 1, `HP: ${playerHp}/${playerMaxHp}`)

    drawRect(
      this.display,
      {
        width: this.display._options.width,
        height: this.display._options.height,
        offsetX: 0,
        offsetY: 0,
      },
      'Attributes',
      '#716391'
    )
  }
}
