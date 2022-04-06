import './style.css'

import { Game } from '@/game'

const game = Game.instance
const app = document.querySelector<HTMLDivElement>('#app')
const container = game.display.getContainer()

if (app && container) {
  app.appendChild(container)
}
