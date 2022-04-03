import { Display } from 'rot-js'
import { Scene } from '@/scene'

export class Game {
  private _display: Display | null = null
  private _scene: Scene | null = null

  public init = (): void => {
    this._display = new Display({ width: 80, height: 20 })

    const bindEventToScene = (eventType: string): void => {
      window.addEventListener(eventType, (event: Event) => {
        this._scene?.processInputEvent(eventType, event)
      })
    }

    bindEventToScene('keydown')
    bindEventToScene('keyup')
    bindEventToScene('keypress')
  }

  public get display(): Display | null {
    return this._display
  }

  public get scene(): Scene | null {
    return this._scene
  }

  public set scene(scene: Scene | null) {
    this._scene?.exit()
    this._display?.clear()
    this._scene = scene
    this._scene?.enter()
    if (this._display) {
      this._scene?.render(this._display)
    }
  }
}
