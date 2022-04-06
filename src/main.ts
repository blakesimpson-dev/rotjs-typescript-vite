import './style.css'

import { Game } from '@/game'
import { fetchAsset } from '@/utils'

let logoAsset, splashAsset

await fetchAsset('/assets/ascii/logo72x8.txt').then((text) => {
  logoAsset = text
})

await fetchAsset('/assets/ascii/splash70x36.txt').then((text) => {
  splashAsset = text
})

// console.log(logoAsset)
// console.log(splashAsset)

export const importedAssets = {
  logo: logoAsset,
  splash: splashAsset,
}

// console.log(importedAssets)

const game = Game.instance
const app = document.querySelector<HTMLDivElement>('#app')
const container = game.display.getContainer()

if (app && container) {
  app.appendChild(container)
}
