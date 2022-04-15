import { BiomeSystem, Entity, EntityFactory, RenderSystem } from '@/lib/aeics'
import { Scene, SceneFactory } from '@/lib/scene'

export class Game {
  private static _instance: Game
  private _currentScene: Scene
  readonly BiomeSystem = BiomeSystem.instance
  readonly renderSystem = RenderSystem.instance
  readonly player: Entity

  constructor() {
    this._currentScene = SceneFactory.instance.sceneCatalog.start

    this.player = EntityFactory.instance.entityCatalog.player
    this.player.dungeon = this._currentScene.dungeon

    this._currentScene.enter()

    const bindEventToScene = (eventType: string): void => {
      window.addEventListener(eventType, (event: Event) => {
        this._currentScene.processInputEvent(eventType, event as KeyboardEvent)
        this.renderSystem.render()
      })
    }

    bindEventToScene('keydown')
    // bindEventToScene('keyup')
    bindEventToScene('keypress')
  }

  get currentScene(): Scene {
    return this._currentScene
  }

  set currentScene(scene: Scene) {
    this._currentScene.exit()
    this._currentScene = scene
    this._currentScene.enter()
    this.renderSystem.render()
  }

  static get instance(): Game {
    if (!Game._instance) {
      Game._instance = new Game()
    }

    return Game._instance
  }
}
