import { Display, KEYS, Map as RotMap } from 'rot-js'
import { Scene } from '@/scene'
import { Map } from '@/map'
import { Tile } from '@/tile'
import { game, displayOptions, scenes, tiles } from '@/main'

export class PlayScene extends Scene {
  private _map: Map | null = null

  constructor() {
    super('Play')
  }

  public enter(): void {
    super.enter()

    const mapTiles: Tile[][] = []
    const width = displayOptions.width ?? Number.NaN
    const height = displayOptions.height ?? Number.NaN

    for (let x = 0; x < width; x++) {
      mapTiles.push([])
      for (let y = 0; y < height; y++) {
        mapTiles[x].push(tiles.emptyTile)
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
        mapTiles[x][y] = tiles.floorTile
      } else {
        mapTiles[x][y] = tiles.wallTile
      }
    })

    console.log(mapTiles.length)
    console.log(mapTiles[0].length)

    this._map = new Map(mapTiles)
  }

  public render(display: Display | null): void {
    const width = this._map?.Width ?? Number.NaN
    const height = this._map?.Height ?? Number.NaN

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const glyph = this._map?.getTile(x, y).Glyph
        display?.draw(
          x,
          y,
          glyph?.Symbol ?? ' ',
          glyph?.ForegroundColor ?? 'white',
          glyph?.BackgroundColor ?? 'black'
        )
      }
    }
  }

  public processInputEvent(eventType: string, event: KeyboardEvent): void {
    if (eventType === 'keydown') {
      switch (event.keyCode) {
        case KEYS.VK_RETURN:
          game.Scene = scenes.winScene
          break

        case KEYS.VK_ESCAPE:
          game.Scene = scenes.loseScene
          break

        default:
          break
      }
    }
  }
}
