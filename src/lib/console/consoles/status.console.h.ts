import { Display as RotDisplay } from 'rot-js'

import { StatusConsoleDispOpt } from '@/display.config'
import { Console } from '@/lib/console'
import { drawRect } from '@/utils'

export class StatusConsole implements Console {
  readonly display: RotDisplay
  readonly container: HTMLElement | null

  constructor() {
    this.display = new RotDisplay(StatusConsoleDispOpt)
    this.container = this.display.getContainer()
  }

  render(): void {
    drawRect(
      this.display,
      {
        width: this.display._options.width,
        height: this.display._options.height,
        offsetX: 0,
        offsetY: 0,
      },
      'Status',
      '#716391'
    )
  }
}
