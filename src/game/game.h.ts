import { DisplayOptions } from 'rot-js/lib/display/types'
import { Display } from 'rot-js'
import { Scene } from '@/scene'

export class Game {
  private _display: Display | null = null
  private _scene: Scene | null = null

  public init(displayConfig: Partial<DisplayOptions>): void {
    this._display = new Display(displayConfig)

    const bindEventToScene = (eventType: string): void => {
      window.addEventListener(eventType, (event: Event) => {
        this._scene?.processInputEvent(eventType, event)
      })
    }

    bindEventToScene('keydown')
    bindEventToScene('keyup')
    bindEventToScene('keypress')
  }

  public get Display(): Display | null {
    return this._display
  }

  public get Scene(): Scene | null {
    return this._scene
  }

  public set Scene(scene: Scene | null) {
    this._scene?.exit()
    this._display?.clear()
    this._scene = scene
    this._scene?.enter()
    if (this._display) {
      this._scene?.render(this._display)
    }
  }
}
