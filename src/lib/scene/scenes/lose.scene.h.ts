import { Display as RotDisplay } from 'rot-js'

import { Scene } from '@/lib/scene'
import { TileMap } from '@/lib/tilemap'

export class LoseScene implements Scene {
  tileMap: TileMap | null = null

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
