import { Display, KEYS, Map as RotMap } from 'rot-js'
import { Game } from '@/game'
import { Scene } from '@/scene'
import { Map } from '@/map'
import { Tile } from '@/tile'

export class PlayScene extends Scene {
  private _map: Map = new Map([])

  public enter(): void {
    const mapTiles: Tile[][] = []
    const width = Game.instance.displayOptions.width ?? 0
    const height = Game.instance.displayOptions.height ?? 0

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

    this._map = new Map(mapTiles)
  }

  public exit(): void {
    console.log('exit WinScene')
  }

  public render(display: Display): void {
    for (let x = 0; x < this._map.width; x++) {
      for (let y = 0; y < this._map.height; y++) {
        const glyph = this._map.getTile(x, y).glyph
        display.draw(x, y, glyph.symbol, glyph.fgColor, glyph.bgColor)
      }
    }
  }

  public processInputEvent(eventType: string, event: KeyboardEvent): void {
    if (eventType === 'keydown') {
      switch (event.keyCode) {
        case KEYS.VK_RETURN:
          Game.instance.currentScene = Game.instance.scenes.win
          break

        case KEYS.VK_ESCAPE:
          Game.instance.currentScene = Game.instance.scenes.lose
          break

        default:
          break
      }
    }
  }
}
