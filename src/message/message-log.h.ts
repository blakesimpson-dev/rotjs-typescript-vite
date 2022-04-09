import { Display as RotDisplay } from 'rot-js'

import { Queue } from '@/common'

export class MessageLog {
  private readonly _maxLines: number
  private readonly _lines: Queue

  constructor() {
    // this._maxLines = Game.instance.messageDisplay._options.height - 2
    this._maxLines = 14
    this._lines = new Queue()
  }

  addMessage(message: string): void {
    this._lines.enqueue(message)
    if (this._lines.count > this._maxLines) {
      this._lines.dequeue()
    }
  }

  render(display: RotDisplay): void {
    const lines: string[] = this._lines.items as string[]
    for (let i = 0; i < lines.length; i++) {
      display.drawText(1, 1 + i, lines[i])
    }
  }
}
