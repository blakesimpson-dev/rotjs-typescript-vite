import './style.css'

import { Game } from '@/game'
import { fetchAsset } from '@/utils'

let logoAsset
await fetchAsset('/assets/ascii/logo72x8.txt').then((text) => {
  logoAsset = text
})

export const importedAssets = {
  logo: logoAsset,
}

const game = Game.instance
const appColOne = document.querySelector<HTMLDivElement>('#app-col-1')
const appColTwo = document.querySelector<HTMLDivElement>('#app-col-2')

const viewContainer = game.viewDisplay.getContainer()
const attributeContainer = game.attributeDisplay.getContainer()
const messageContainer = game.messageDisplay.getContainer()
const surroundContainer = game.surroundDisplay.getContainer()
const statusContainer = game.statusDisplay.getContainer()

if (appColOne && viewContainer && attributeContainer && messageContainer) {
  appColOne.appendChild(viewContainer)
  appColOne.appendChild(attributeContainer)
  appColOne.appendChild(messageContainer)
}

if (appColTwo && surroundContainer && statusContainer) {
  appColTwo.appendChild(surroundContainer)
  appColTwo.appendChild(statusContainer)
}
