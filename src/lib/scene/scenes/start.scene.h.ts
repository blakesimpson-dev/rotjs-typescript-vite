import { Display as RotDisplay, KEYS as RotKeys } from 'rot-js'

import { BiomeSystem } from '@/lib/ecs'
import { Game } from '@/lib/game'
import { TileMap } from '@/lib/map'
import { Scene, SceneFactory } from '@/lib/scene'

// import { importedAssets } from '@/main'
// import { removeRotColorNotation, renderAsciiAsset } from '@/utils'

export class StartScene implements Scene {
  map: TileMap | null = null

  enter(): void {
    console.log('enter StartScene')
  }

  exit(): void {
    console.log('exit StartScene')
  }

  render(display: RotDisplay): void {
    // const viewWidth = display._options.width
    const viewHeight = display._options.height
    // const logoDimensions = { w: 72, h: 8 }
    // const logoOffset = { x: (viewWidth - logoDimensions.w) / 2, y: 4 }

    // renderAsciiAsset(
    //   display,
    //   importedAssets.logo ?? '',
    //   'white',
    //   'black',
    //   logoOffset.x,
    //   logoOffset.y
    // )

    const info = `%c{cyan}RotJS + Typescript + Vite Vanilla Roguelike%c{white} Press %c{yellow}[Enter]%c{white} to start`
    // const infoDimensions = { w: removeRotColorNotation(info).length, h: 1 }
    // const infoOffset = {
    //   x: (viewWidth - infoDimensions.w) / 2,
    //   y: logoOffset.y + logoDimensions.h + 4,
    // }
    const infoOffset = {
      x: 1,
      y: 1,
    }
    display.drawText(infoOffset.x, infoOffset.y, info)

    const author = `Blake Simpson %c{gray}https://blakesimpson.dev`
    // const authorDimensions = { w: removeRotColorNotation(author).length, h: 1 }
    // const authorOffset = {
    //   x: (viewWidth - authorDimensions.w) / 2,
    //   y: infoOffset.y + infoDimensions.h + 2,
    // }
    const authorOffset = {
      x: 1,
      y: viewHeight - 2,
    }
    display.drawText(authorOffset.x, authorOffset.y, author)
  }

  processInputEvent(eventType: string, event: KeyboardEvent): void {
    if (eventType === 'keydown') {
      switch (event.keyCode) {
        case RotKeys.VK_RETURN:
          Game.instance.currentScene = SceneFactory.instance.sceneCatalog.play
          break

        case RotKeys.VK_1:
          BiomeSystem.instance.currentBiome = 'Cave'
          break

        case RotKeys.VK_2:
          BiomeSystem.instance.currentBiome = 'Forest'
          break

        default:
          break
      }
    }
  }
}
