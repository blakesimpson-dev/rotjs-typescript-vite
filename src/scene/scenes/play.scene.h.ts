import { Display, KEYS } from 'rot-js'
import { Scene } from '@/scene'
import { game, winScene, loseScene } from '@/main'

export class PlayScene extends Scene {
  constructor() {
    super('Play')
  }

  public render = (display: Display | null): void => {
    display?.drawText(3, 5, '%c{red}%b{white}This game is so much fun!')
    display?.drawText(4, 6, 'Press [Enter] to win, or [Esc] to lose!')
  }

  public processInputEvent(eventType: string, event: KeyboardEvent): void {
    if (eventType === 'keydown') {
      switch (event.keyCode) {
        case KEYS.VK_RETURN:
          game.scene = winScene
          break

        case KEYS.VK_ESCAPE:
          game.scene = loseScene
          break

        default:
          break
      }
    }
  }
}
