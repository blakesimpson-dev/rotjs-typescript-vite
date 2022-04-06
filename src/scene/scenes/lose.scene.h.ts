import { Display } from 'rot-js'

import { Scene } from '@/scene'

export class LoseScene implements Scene {
  enter(): void {
    console.log('enter LoseScene')
  }

  exit(): void {
    console.log('exit LoseScene')
  }

  render(display: Display): void {
    for (let i = 0; i < 22; i++) {
      display.drawText(2, i + 1, '%b{red}You lose! :(')
    }
  }

  processInputEvent(eventType: string, event: KeyboardEvent): void {
    console.log(`${eventType} detected: ${event.keyCode}`)
  }
}
