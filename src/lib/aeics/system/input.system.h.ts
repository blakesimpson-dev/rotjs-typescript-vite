import { RenderSystem } from '@/lib/aeics'
import { Console } from '@/lib/console'

export class InputSystem {
  private static _instance: InputSystem
  private _targetConsole: Console

  get targetConsole(): Console {
    return this._targetConsole
  }

  set targetConsole(target: Console) {
    this._targetConsole = target
  }

  constructor() {
    this._targetConsole = RenderSystem.instance.viewConsole

    const bindInputEvent = (eventType: string): void => {
      window.addEventListener(eventType, (event: Event) => {
        this.processInputEvent(eventType, event as KeyboardEvent)
        RenderSystem.instance.render()
      })
    }

    bindInputEvent('keydown')
    // bindInputEvent('keyup')
    bindInputEvent('keypress')
  }

  processInputEvent(eventType: string, event: KeyboardEvent): void {
    this.targetConsole.processInputEvent(eventType, event as KeyboardEvent)
  }

  static get instance(): InputSystem {
    if (!InputSystem._instance) {
      InputSystem._instance = new InputSystem()
    }

    return InputSystem._instance
  }
}
