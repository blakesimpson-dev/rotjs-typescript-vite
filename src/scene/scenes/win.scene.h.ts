import { Display, Color } from 'rot-js'
import { Scene } from '@/scene'

export class WinScene extends Scene {
  public enter(): void {
    console.log('enter WinScene')
  }

  public exit(): void {
    console.log('exit WinScene')
  }

  public render(display: Display): void {
    for (let i = 0; i < 22; i++) {
      const r = Math.round(Math.random() * 255)
      const g = Math.round(Math.random() * 255)
      const b = Math.round(Math.random() * 255)
      const background = Color.toRGB([r, g, b])
      display.drawText(2, i + 1, '%b{' + background + '}You win!')
    }
  }

  public processInputEvent(eventType: string, event: KeyboardEvent): void {
    console.log(`${eventType} detected: ${event.keyCode}`)
  }
}
