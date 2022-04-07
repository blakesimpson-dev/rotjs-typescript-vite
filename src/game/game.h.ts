import { Display as RotDisplay } from 'rot-js'
import { DisplayOptions } from 'rot-js/lib/display/types'

import { Entity, EntityFactory } from '@/entity'
import { Scene, SceneFactory } from '@/scene'

export class Game {
  private static _instance: Game
  private _currentScene: Scene

  readonly displayOptions: Partial<DisplayOptions>
  readonly display: RotDisplay
  readonly player: Entity

  constructor() {
    this.displayOptions = {
      width: 128,
      height: 64,
      fontSize: 16,
      forceSquareRatio: true,
      fontFamily: 'unscii-8',
    }
    this.display = new RotDisplay(this.displayOptions)
    this.player = EntityFactory.instance.entityCatalog.player

    this._currentScene = SceneFactory.instance.sceneCatalog.start
    this.player.map = this._currentScene.map
    this.display.clear()
    this._currentScene.enter()
    this._currentScene.render(this.display)

    const bindEventToScene = (eventType: string): void => {
      window.addEventListener(eventType, (event: Event) => {
        this._currentScene.processInputEvent(eventType, event as KeyboardEvent)
        this.refresh()
      })
    }

    bindEventToScene('keydown')
    // bindEventToScene('keyup')
    // bindEventToScene('keypress')
  }

  static get instance(): Game {
    if (!Game._instance) {
      Game._instance = new Game()
    }

    return Game._instance
  }

  get currentScene(): Scene {
    return this._currentScene
  }

  set currentScene(scene: Scene) {
    this._currentScene.exit()
    this._currentScene = scene
    this._currentScene.enter()
    this.refresh()
  }

  refresh(): void {
    this.display.clear()
    this._currentScene.render(this.display)
  }
}
