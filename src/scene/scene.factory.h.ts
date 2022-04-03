import { SceneCollection } from './'
import { StartScene, PlayScene, WinScene, LoseScene } from '@/scene'

export class SceneFactory {
  private static _instance: SceneFactory

  private _scenes: SceneCollection

  constructor() {
    this._scenes = {
      start: new StartScene(),
      play: new PlayScene(),
      win: new WinScene(),
      lose: new LoseScene(),
    }
  }

  public get scenes(): SceneCollection {
    return this._scenes
  }

  public static get instance(): SceneFactory {
    if (!SceneFactory._instance) {
      SceneFactory._instance = new SceneFactory()
    }

    return SceneFactory._instance
  }
}
