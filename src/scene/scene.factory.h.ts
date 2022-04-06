import { SceneCatalog, Scenes } from '@/scene'

export class SceneFactory {
  private static _instance: SceneFactory
  readonly sceneCatalog: SceneCatalog

  constructor() {
    this.sceneCatalog = {
      start: new Scenes.StartScene(),
      play: new Scenes.PlayScene(),
      win: new Scenes.WinScene(),
      lose: new Scenes.LoseScene(),
    }
  }

  static get instance(): SceneFactory {
    if (!SceneFactory._instance) {
      SceneFactory._instance = new SceneFactory()
    }

    return SceneFactory._instance
  }
}
