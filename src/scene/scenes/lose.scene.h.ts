import { Display } from 'rot-js'
import { Scene } from '@/scene'

export class LoseScene extends Scene {
  constructor() {
    super('Lose')
  }

  public render = (display: Display | null): void => {
    for (let i = 0; i < 22; i++) {
      display?.drawText(2, i + 1, '%b{red}You lose! :(')
    }
  }

  public processInputEvent(eventType: string, event: KeyboardEvent): void {
    console.log(`${eventType} detected: ${event.keyCode}`)
  }
}
