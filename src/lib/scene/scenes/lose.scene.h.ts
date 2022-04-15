import { Display as RotDisplay } from 'rot-js'

import { Dungeon } from '@/lib/dungeon'
import { Scene } from '@/lib/scene'

export class LoseScene implements Scene {
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
    console.log('enter LoseScene')
  }

  exit(): void {
    console.log('exit LoseScene')
  }

  render(display: RotDisplay): void {
    for (let i = 0; i < 22; i++) {
      display.drawText(2, i + 1, '%b{red}You lose! :(')
    }
  }

  processInputEvent(eventType: string, event: KeyboardEvent): void {
    console.log(`${eventType} detected: ${event.keyCode}`)
  }
}
