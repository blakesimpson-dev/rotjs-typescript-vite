import { Display } from 'rot-js'
import { Scene } from '@/scene'

export class LoseScene extends Scene {
  public enter(): void {
    console.log('enter LoseScene')
  }

  public exit(): void {
    console.log('exit LoseScene')
  }

  public render(display: Display): void {
    for (let i = 0; i < 22; i++) {
      display.drawText(2, i + 1, '%b{red}You lose! :(')
    }
  }

  public processInputEvent(eventType: string, event: KeyboardEvent): void {
    console.log(`${eventType} detected: ${event.keyCode}`)
  }
}
