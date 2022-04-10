import { Display as RotDisplay } from 'rot-js'

import { TileMap } from '@/lib/map'
import { Scene } from '@/lib/scene'

export class LoseScene implements Scene {
  map: TileMap | null = null

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
