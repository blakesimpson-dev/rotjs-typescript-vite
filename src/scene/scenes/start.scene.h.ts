import { Display, KEYS } from 'rot-js'
import { Game } from '@/game'
import { Scene } from '@/scene'

export class StartScene extends Scene {
  public enter(): void {
    console.log('enter StartScene')
  }

  public exit(): void {
    console.log('exit StartScene')
  }

  public render(display: Display): void {
    display.drawText(
      1,
      1,
      '%c{yellow}RotJS + Typescript + Vite Vanilla Roguelike'
    )
    display.drawText(1, 2, 'Press [Enter] to start!')
  }

  public processInputEvent(eventType: string, event: KeyboardEvent): void {
    if (eventType === 'keydown') {
      switch (event.keyCode) {
        case KEYS.VK_RETURN:
          Game.instance.currentScene = Game.instance.scenes.play
          break

        default:
          break
      }
    }
  }
}
