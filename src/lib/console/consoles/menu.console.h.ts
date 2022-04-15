import { Display as RotDisplay } from 'rot-js'

import { MenuConsoleDispOpt } from '@/display.config'
import { Console } from '@/lib/console'
import { drawRect } from '@/utils'

export class MenuConsole implements Console {
  readonly display: RotDisplay
  readonly container: HTMLElement | null

  constructor() {
    this.display = new RotDisplay(MenuConsoleDispOpt)
    this.container = this.display.getContainer()
  }

  render(args?: Record<string, any>): void {
    if (args?.mode === 'Inventory') {
      this.renderInventoryMenu()
    }

    drawRect(
      this.display,
      {
        width: this.display._options.width,
        height: this.display._options.height,
        offsetX: 0,
        offsetY: 0,
      },
      args?.mode,
      '#716391'
    )
  }

  renderInventoryMenu() {
    console.log('renderInventoryMenu')
  }

  renderItemList() {
    const letters = 'abcdefghijklmnopqrstuvwxyz'
  }
}
