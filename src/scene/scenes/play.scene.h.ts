import { Display, KEYS, Map as RotMap } from 'rot-js'

import { TransformComponent } from '@/component'
import { Game } from '@/game'
import { Map } from '@/map'
import { Scene } from '@/scene'
import { Tile } from '@/tile'

export class PlayScene implements Scene {
  map: Map = new Map({ tiles: [] })

  enter(): void {
    const mapTiles: Tile[][] = []
    // const width = Game.instance.displayOptions.width ?? 0
    // const height = Game.instance.displayOptions.height ?? 0
    const width = 500
    const height = 500

    for (let x = 0; x < width; x++) {
      mapTiles.push([])
      for (let y = 0; y < height; y++) {
        mapTiles[x].push(Game.instance.tiles.empty)
      }
    }

    const generator = new RotMap.Cellular(width, height)
    generator.randomize(0.5)

    const totalIterations = 3
    for (let i = 0; i < totalIterations - 1; i++) {
      generator.create()
    }

    generator.create((x, y, v) => {
      if (v === 1) {
        mapTiles[x][y] = Game.instance.tiles.floor
      } else {
        mapTiles[x][y] = Game.instance.tiles.wall
      }
    })

    this.map = new Map({ tiles: mapTiles })

    const position = this.map.getRandomFloorTilePosition()
    const playerPosition =
      Game.instance.player.getComponent(TransformComponent).position

    playerPosition.x = position.x
    playerPosition.y = position.y
  }

  exit(): void {
    console.log('exit WinScene')
  }

  render(display: Display): void {
    const displayWidth = Game.instance.displayOptions.width ?? 0
    const displayHeight = Game.instance.displayOptions.height ?? 0

    const playerPosition =
      Game.instance.player.getComponent(TransformComponent).position

    let rootX = Math.max(0, playerPosition.x - displayWidth / 2)
    rootX = Math.min(rootX, this.map.width - displayWidth)

    let rootY = Math.max(0, playerPosition.y - displayHeight / 2)
    rootY = Math.min(rootY, this.map.height - displayHeight)

    for (let x = rootX; x < rootX + displayWidth; x++) {
      for (let y = rootY; y < rootY + displayHeight; y++) {
        const glyph = this.map.getTile(x, y).glyph
        display.draw(
          x - rootX,
          y - rootY,
          glyph.symbol,
          glyph.fgColor,
          glyph.bgColor
        )
      }
    }

    const playerGlyph = Game.instance.player.glyph

    display.draw(
      playerPosition.x - rootX,
      playerPosition.y - rootY,
      playerGlyph.symbol,
      playerGlyph.fgColor,
      playerGlyph.bgColor
    )
  }

  processInputEvent(eventType: string, event: KeyboardEvent): void {
    if (eventType === 'keydown') {
      switch (event.keyCode) {
        case KEYS.VK_RETURN:
          Game.instance.currentScene = Game.instance.scenes.win
          break

        case KEYS.VK_ESCAPE:
          Game.instance.currentScene = Game.instance.scenes.lose
          break

        case KEYS.VK_LEFT:
          this.movePlayer(-1, 0)
          break

        case KEYS.VK_RIGHT:
          this.movePlayer(1, 0)
          break

        case KEYS.VK_UP:
          this.movePlayer(0, -1)
          break

        case KEYS.VK_DOWN:
          this.movePlayer(0, 1)
          break

        default:
          break
      }
    }
  }

  private movePlayer(dX: number, dY: number): void {
    const playerTransform =
      Game.instance.player.getComponent(TransformComponent)

    const newX = playerTransform.position.x + dX
    const newY = playerTransform.position.y + dY
    playerTransform.translate(newX, newY, this.map)
  }
}
