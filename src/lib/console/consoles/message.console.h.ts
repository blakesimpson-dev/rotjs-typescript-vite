import { Display as RotDisplay } from 'rot-js'

import { MessageConsoleDispOpt } from '@/display.config'
import { Queue } from '@/lib/common'
import { Console } from '@/lib/console'
import { drawRect } from '@/utils'

export class MessageConsole implements Console {
  private readonly _maxLines: number
  private _lines: Queue
  readonly display: RotDisplay
  readonly container: HTMLElement | null

  constructor() {
    this.display = new RotDisplay(MessageConsoleDispOpt)
    this.container = this.display.getContainer()
    this._maxLines = this.display._options.height - 2
    this._lines = new Queue()
  }

  render(): void {
    const lines: string[] = this._lines.items as string[]
    for (let i = 0; i < lines.length; i++) {
      this.display.drawText(1, 1 + i, lines[i])
    }

    drawRect(
      this.display,
      {
        width: this.display._options.width,
        height: this.display._options.height,
        offsetX: 0,
        offsetY: 0,
      },
      'Messages',
      '#716391'
    )
  }

  addMessage(message: string): void {
    this._lines.enqueue(message)
    if (this._lines.count > this._maxLines) {
      this._lines.dequeue()
    }
  }

  clearMessages(): void {
    this._lines = new Queue()
  }
}
