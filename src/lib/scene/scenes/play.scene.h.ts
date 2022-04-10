import {
  Color as RotColor,
  Display as RotDisplay,
  KEYS as RotKeys,
  Map as RotMap,
} from 'rot-js'

import { Components, Entity, EntityFactory } from '@/lib/ecs'
import { Game } from '@/lib/game'
import { Glyph } from '@/lib/glyph'
import { Scene, SceneFactory } from '@/lib/scene'
import { Tile, Tiles } from '@/lib/tile'
import { TileMap } from '@/lib/tilemap'

import { Position } from '../../common/position.h'

export class PlayScene implements Scene {
  tileMap: TileMap | null = null

  enter(): void {
    const tiles: Tile[][] = []
    const width = 100
    const height = 100

    for (let x = 0; x < width; x++) {
      tiles.push([])
      for (let y = 0; y < height; y++) {
        tiles[x].push({ ...Tiles.Empty })
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
        tiles[x][y] = {
          ...Tiles.Floor,
          glyph: new Glyph({ ...Tiles.Floor.glyph }),
          position: new Position(x, y),
        }
      } else {
        tiles[x][y] = {
          ...Tiles.Wall,
          glyph: new Glyph({ ...Tiles.Wall.glyph }),
          position: new Position(x, y),
        }
      }
      if (y === 0 || y === height - 1) {
        tiles[x][y] = {
          ...Tiles.Bounds,
          glyph: new Glyph({ ...Tiles.Bounds.glyph }),
          position: new Position(x, y),
        }
      } else if (x === 0 || x === width - 1) {
        tiles[x][y] = {
          ...Tiles.Bounds,
          glyph: new Glyph({ ...Tiles.Bounds.glyph }),
          position: new Position(x, y),
        }
      }

      const rndFgColor = RotColor.randomize(
        RotColor.fromString(tiles[x][y].glyph.fgColor),
        [20, 20, 20]
      )
      tiles[x][y].glyph.fgColor = RotColor.toHex(rndFgColor)
    })

    this.tileMap = new TileMap({ tiles: tiles })

    this.tileMap.addEntityAtRndFloorTilePos(Game.instance.player)

    for (let i = 0; i < 80; i++) {
      this.tileMap.addEntityAtRndFloorTilePos(
        EntityFactory.instance.createKoboldEntity()
      )
    }

    this.tileMap.engine.start()
  }

  exit(): void {
    console.log('exit WinScene')
  }

  render(display: RotDisplay): void {
    const displayWidth = display._options.width - 2
    const displayHeight = display._options.height - 2
    const mapWidth = this.tileMap?.width ?? 0
    const mapHeight = this.tileMap?.height ?? 0

    // todo remove later
    const lineDebug = this.tileMap?.getTilesAlongLine(0, 0, 20, 20)
    lineDebug?.forEach((tile) => {
      tile.glyph = new Glyph({
        symbol: 'X',
        fgColor: 'yellow',
      })
    })

    // todo remove later
    const radiusDebug = this.tileMap?.getTilesInRadius(30, 10, 5)
    radiusDebug?.forEach((tile) => {
      tile.glyph = new Glyph({
        symbol: 'X',
        fgColor: 'yellow',
      })
    })

    const playerPosition = Game.instance.player.getComponent(
      Components.TransformComponent
    ).position

    let rootX = Math.max(0, playerPosition.x - displayWidth / 2)
    rootX = Math.min(rootX, mapWidth - displayWidth)

    let rootY = Math.max(0, playerPosition.y - displayHeight / 2)
    rootY = Math.min(rootY, mapHeight - displayHeight)

    for (let x = rootX; x < rootX + displayWidth; x++) {
      for (let y = rootY; y < rootY + displayHeight; y++) {
        const glyph = this.tileMap?.getTileAt(x, y).glyph
        display.draw(
          x - rootX + 1,
          y - rootY + 1,
          glyph?.symbol ?? Glyph.errorSymbol,
          glyph?.fgColor ?? Glyph.errorFgColor,
          glyph?.bgColor ?? Glyph.errorBgColor
        )
      }
    }

    this.tileMap?.entities.forEach((entity: Entity) => {
      const entityPosition = entity.getComponent(
        Components.TransformComponent
      ).position
      if (
        entityPosition.x >= rootX &&
        entityPosition.y >= rootY &&
        entityPosition.x < rootX + displayWidth &&
        entityPosition.y < rootY + displayHeight
      ) {
        display.draw(
          entityPosition.x - rootX + 1,
          entityPosition.y - rootY + 1,
          entity.glyph.symbol,
          entity.glyph.fgColor,
          entity.glyph.bgColor
        )
      }
    })
  }

  processInputEvent(eventType: string, event: KeyboardEvent): void {
    if (eventType === 'keydown') {
      switch (event.keyCode) {
        case RotKeys.VK_RETURN:
          Game.instance.currentScene = SceneFactory.instance.sceneCatalog.win
          break

        case RotKeys.VK_ESCAPE:
          Game.instance.currentScene = SceneFactory.instance.sceneCatalog.lose
          break

        case RotKeys.VK_LEFT:
          this.movePlayer(-1, 0)
          this.tileMap?.engine.unlock()
          break

        case RotKeys.VK_RIGHT:
          this.movePlayer(1, 0)
          this.tileMap?.engine.unlock()
          break

        case RotKeys.VK_UP:
          this.movePlayer(0, -1)
          this.tileMap?.engine.unlock()
          break

        case RotKeys.VK_DOWN:
          this.movePlayer(0, 1)
          this.tileMap?.engine.unlock()
          break

        default:
          break
      }
    }
  }

  private movePlayer(dX: number, dY: number): void {
    const playerTransform = Game.instance.player.getComponent(
      Components.TransformComponent
    )

    const newX = playerTransform.position.x + dX
    const newY = playerTransform.position.y + dY
    if (this.tileMap) {
      playerTransform.tryMove(newX, newY, this.tileMap)
    }
  }
}
