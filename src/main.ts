import { DisplayOptions } from 'rot-js/lib/display/types'
import { Game } from '@/game'
import { Scene, StartScene, PlayScene, WinScene, LoseScene } from '@/scene'
import { Tile } from '@/tile'
import { Glyph } from '@/glyph'
import './style.css'

export const displayOptions: Partial<DisplayOptions> = {
  width: 128,
  height: 64,
}

export const game = new Game()
game.init(displayOptions)

const startScene: Scene = new StartScene()
const playScene: Scene = new PlayScene()
const winScene: Scene = new WinScene()
const loseScene: Scene = new LoseScene()

export const scenes = {
  startScene,
  playScene,
  winScene,
  loseScene,
}

const emptyTile: Tile = new Tile(new Glyph())
const floorTile: Tile = new Tile(new Glyph('.'))
const wallTile: Tile = new Tile(new Glyph('#'))

export const tiles = {
  emptyTile,
  floorTile,
  wallTile,
}

const app = document.querySelector<HTMLDivElement>('#app')
const container = game.Display?.getContainer()
if (container) {
  app?.appendChild(container)
}

game.Scene = startScene
