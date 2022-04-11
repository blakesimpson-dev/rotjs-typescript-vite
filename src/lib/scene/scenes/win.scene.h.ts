import { Color as RotColor, Display as RotDisplay } from 'rot-js'

import { Dungeon } from '@/lib/dungeon'
import { Scene } from '@/lib/scene'

export class WinScene implements Scene {
  dungeon: Dungeon | null = null

  enter(): void {
    console.log('enter WinScene')
  }

  exit(): void {
    console.log('exit WinScene')
  }

  render(display: RotDisplay): void {
    for (let i = 0; i < 22; i++) {
      const r = Math.round(Math.random() * 255)
      const g = Math.round(Math.random() * 255)
      const b = Math.round(Math.random() * 255)
      const background = RotColor.toRGB([r, g, b])
      display.drawText(2, i + 1, '%b{' + background + '}You win!')
    }
  }

  processInputEvent(eventType: string, event: KeyboardEvent): void {
    console.log(`${eventType} detected: ${event.keyCode}`)
  }
}
