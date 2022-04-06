import { Display as RotDisplay, KEYS as RotKeys } from 'rot-js'

import { Game } from '@/game'
import { importedAssets } from '@/main'
import { Map } from '@/map'
import { Scene, SceneFactory } from '@/scene'
import { TileFactory } from '@/tile'
import { removeRotColorNotation, renderAsciiAsset } from '@/utils'

export class StartScene implements Scene {
  map: Map | null = null

  enter(): void {
    console.log('enter StartScene')
  }

  exit(): void {
    console.log('exit StartScene')
  }

  render(display: RotDisplay): void {
    const screenWidth = 128

    const logoDimensions = { w: 72, h: 8 }
    const logoOffset = { x: (screenWidth - logoDimensions.w) / 2, y: 4 }

    renderAsciiAsset(
      display,
      importedAssets.logo ?? '',
      'white',
      'black',
      logoOffset.x,
      logoOffset.y
    )

    const info = `%c{cyan}RotJS + Typescript + Vite Vanilla Roguelike%c{white} - Press %c{yellow}[Enter]%c{white} to start`
    const infoDimensions = { w: removeRotColorNotation(info).length, h: 1 }
    const infoOffset = {
      x: (screenWidth - infoDimensions.w) / 2,
      y: logoOffset.y + logoDimensions.h + 4,
    }
    display.drawText(infoOffset.x, infoOffset.y, info)

    const splashDimensions = { w: 70, h: 36 }
    const splashOffset = {
      x: (screenWidth - splashDimensions.w) / 2,
      y: infoOffset.y + 4,
    }

    renderAsciiAsset(
      display,
      importedAssets.splash ?? '',
      'white',
      'black',
      splashOffset.x,
      splashOffset.y
    )

    const author = `Blake Simpson %c{gray}https://blakesimpson.dev`
    const authorDimensions = { w: removeRotColorNotation(author).length, h: 1 }
    const authorOffset = {
      x: (screenWidth - authorDimensions.w) / 2,
      y: splashOffset.y + splashDimensions.h + 4,
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
          TileFactory.instance.setBiome('Cave')
          Game.instance.refresh()
          break

        case RotKeys.VK_2:
          TileFactory.instance.setBiome('Forest')
          Game.instance.refresh()
          break

        default:
          break
      }
    }
  }
}
