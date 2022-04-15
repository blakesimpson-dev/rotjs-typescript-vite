import '@/style.css'

import { RenderSystem } from '@/lib/aeics'
import { Game } from '@/lib/game'

// import { fetchAsset } from '@/utils'

// export const importedAssets = {
//   logo: '',
// }

// await fetchAsset('/assets/ascii/logo72x8.txt').then((text) => {
//   importedAssets.logo = text
// })

const game = Game.instance
const appColOne = document.querySelector<HTMLDivElement>('#app-col-1')
const appColTwo = document.querySelector<HTMLDivElement>('#app-col-2')
const renderSystem = RenderSystem.instance
const viewContainer = renderSystem.viewConsole.container
const menuContainer = renderSystem.menuConsole.container
const attributesContainer = renderSystem.attributesConsole.container
const messageContainer = renderSystem.messageConsole.container
const surroundsContainer = renderSystem.surroundsConsole.container
const statusContainer = renderSystem.statusConsole.container

if (
  appColOne &&
  appColTwo &&
  viewContainer &&
  menuContainer &&
  attributesContainer &&
  messageContainer &&
  surroundsContainer &&
  statusContainer
) {
  appColOne.appendChild(viewContainer)
  appColOne.appendChild(menuContainer)
  appColOne.appendChild(attributesContainer)
  appColOne.appendChild(messageContainer)
  appColTwo.appendChild(surroundsContainer)
  appColTwo.appendChild(statusContainer)
  game.renderSystem.render()
}
