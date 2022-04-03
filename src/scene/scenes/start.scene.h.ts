import { Display, KEYS } from 'rot-js'
import { Scene } from '@/scene'
import { game, scenes } from '@/main'

export class StartScene extends Scene {
  constructor() {
    super('Start')
  }

  public render(display: Display | null): void {
    display?.drawText(
      1,
      1,
      '%c{yellow}RotJS + Typescript + Vite Vanilla Roguelike'
    )
    display?.drawText(1, 2, 'Press [Enter] to start!')
  }

  public processInputEvent(eventType: string, event: KeyboardEvent): void {
    if (eventType === 'keydown') {
      switch (event.keyCode) {
        case KEYS.VK_RETURN:
          game.Scene = scenes.playScene
          break

        default:
          break
      }
    }
  }
}
