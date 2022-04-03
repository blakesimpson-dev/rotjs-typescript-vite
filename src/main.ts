import { Game } from '@/game'
import './style.css'

const game = Game.instance
const app = document.querySelector<HTMLDivElement>('#app')
const container = game.display.getContainer()

if (app && container) {
  app.appendChild(container)
}
