import { Display as RotDisplay } from 'rot-js'

import { ViewConsoleDispOpt } from '@/display.config'
import { Console } from '@/lib/console'
import { Game } from '@/lib/game'
import { drawRect } from '@/utils'

export class ViewConsole implements Console {
  readonly display: RotDisplay
  readonly container: HTMLElement | null

  constructor() {
    this.display = new RotDisplay(ViewConsoleDispOpt)
    this.container = this.display.getContainer()
  }

  render(): void {
    Game.instance.currentScene.render(this.display)

    drawRect(
      this.display,
      {
        width: this.display._options.width,
        height: this.display._options.height,
        offsetX: 0,
        offsetY: 0,
      },
      undefined,
      '#716391'
    )
  }
}
