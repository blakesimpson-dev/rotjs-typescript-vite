import { Color as RotColor, Display as RotDisplay } from 'rot-js'

import { Dungeon } from '@/lib/dungeon'
import { Scene } from '@/lib/scene'

export class WinScene implements Scene {
  dungeon: Dungeon | null = null
  flags: Record<string, boolean> = {}

  setFlag(key: string, value: boolean): void {
    const existingKeys = Object.keys(this.flags)
    if (existingKeys.indexOf(key) === -1) {
      throw new Error(
        `setFlag(key: ${key}, value: ${value}): Cannot set flag that does not exist`
      )
    } else {
      this.flags[key] = value
    }
  }

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
