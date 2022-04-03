import { Game } from '@/game'
import { Scene, StartScene, PlayScene, WinScene, LoseScene } from '@/scene'
import './style.css'

export const game = new Game()
game.init()

const app = document.querySelector<HTMLDivElement>('#app')
const container = game.display?.getContainer()
if (container) {
  app?.appendChild(container)
}

export const startScene: Scene = new StartScene()
export const playScene: Scene = new PlayScene()
export const winScene: Scene = new WinScene()
export const loseScene: Scene = new LoseScene()

game.scene = startScene
