import { Display } from 'rot-js'
import { DisplayOptions } from 'rot-js/lib/display/types'

import { Entity, EntityCollection, EntityFactory } from '@/entity'
import { Scene, SceneCollection, SceneFactory } from '@/scene'
import { TileCollection, TileFactory } from '@/tile'

export class Game {
  private static _instance: Game
  private _currentScene: Scene

  readonly displayOptions: Partial<DisplayOptions>
  readonly display: Display
  readonly scenes: SceneCollection
  readonly tiles: TileCollection
  readonly entities: EntityCollection
  readonly player: Entity

  constructor() {
    this.displayOptions = { width: 128, height: 64 }
    this.display = new Display(this.displayOptions)
    this.scenes = SceneFactory.instance.scenes
    this.tiles = TileFactory.instance.tiles
    this.entities = EntityFactory.instance.entities
    this.player = this.entities.player

    this._currentScene = this.scenes.start
    this.display.clear()
    this._currentScene.enter()
    this._currentScene.render(this.display)

    const bindEventToScene = (eventType: string): void => {
      window.addEventListener(eventType, (event: Event) => {
        this._currentScene.processInputEvent(eventType, event as KeyboardEvent)
        this.display.clear()
        this._currentScene.render(this.display)
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
    this.display.clear()
    this._currentScene = scene
    this._currentScene.enter()
    this._currentScene.render(this.display)
  }
}
