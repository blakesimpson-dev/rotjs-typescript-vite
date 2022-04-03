import { DisplayOptions } from 'rot-js/lib/display/types'
import { Display } from 'rot-js'
import { SceneCollection, SceneFactory, Scene } from '@/scene'
import { TileCollection, TileFactory } from '@/tile'

export class Game {
  private static _instance: Game

  private _displayOptions: Partial<DisplayOptions>
  private _display: Display
  private _scenes: SceneCollection
  private _tiles: TileCollection
  private _currentScene: Scene

  constructor() {
    this._displayOptions = { width: 128, height: 64 }
    this._display = new Display(this._displayOptions)
    this._scenes = SceneFactory.instance.scenes
    this._tiles = TileFactory.instance.tiles

    this._currentScene = this._scenes.start
    this._display.clear()
    this._currentScene.enter()
    this._currentScene.render(this._display)

    const bindEventToScene = (eventType: string): void => {
      window.addEventListener(eventType, (event: Event) => {
        this._currentScene.processInputEvent(eventType, event)
      })
    }

    bindEventToScene('keydown')
    bindEventToScene('keyup')
    bindEventToScene('keypress')
  }

  public static get instance(): Game {
    if (!Game._instance) {
      Game._instance = new Game()
    }

    return Game._instance
  }

  public get displayOptions(): Partial<DisplayOptions> {
    return this._displayOptions
  }

  public get display(): Display {
    return this._display
  }

  public get scenes(): SceneCollection {
    return this._scenes
  }

  public get tiles(): TileCollection {
    return this._tiles
  }

  public get currentScene(): Scene {
    return this._currentScene
  }

  public set currentScene(scene: Scene) {
    this._currentScene.exit()
    this._display.clear()
    this._currentScene = scene
    this._currentScene.enter()
    this._currentScene.render(this._display)
  }
}
