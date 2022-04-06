import {
  LoseScene,
  PlayScene,
  SceneCollection,
  StartScene,
  WinScene,
} from '@/scene'

export class SceneFactory {
  private static _instance: SceneFactory
  readonly scenes: SceneCollection

  constructor() {
    this.scenes = {
      start: new StartScene(),
      play: new PlayScene(),
      win: new WinScene(),
      lose: new LoseScene(),
    }
  }

  static get instance(): SceneFactory {
    if (!SceneFactory._instance) {
      SceneFactory._instance = new SceneFactory()
    }

    return SceneFactory._instance
  }
}
