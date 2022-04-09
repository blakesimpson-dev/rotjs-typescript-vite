import { Display as RotDisplay, KEYS as RotKeys, Map as RotMap } from 'rot-js'

import { Position } from '@/common'
import { Components } from '@/component'
import { Entity, EntityFactory } from '@/entity'
import { Game } from '@/game'
import { Glyph } from '@/glyph'
import { Map, MapTile } from '@/map'
import { Scene, SceneFactory } from '@/scene'
import { Tile, TileFactory } from '@/tile'

export class PlayScene implements Scene {
  map: Map | null = null

  enter(): void {
    const mapTiles: MapTile[][] = []
    const width = 200
    const height = 200

    for (let x = 0; x < width; x++) {
      mapTiles.push([])
      for (let y = 0; y < height; y++) {
        mapTiles[x].push({
          tile: TileFactory.instance.tileCatalog.empty,
          pos: Position.zero(),
        })
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
        mapTiles[x][y].tile = TileFactory.instance.tileCatalog.floor
      } else {
        mapTiles[x][y].tile = TileFactory.instance.tileCatalog.wall
      }
      if (y === 0 || y === height - 1) {
        mapTiles[x][y].tile = TileFactory.instance.tileCatalog.bounds
      } else if (x === 0 || x === width - 1) {
        mapTiles[x][y].tile = TileFactory.instance.tileCatalog.bounds
      }

      mapTiles[x][y].pos.x = x
      mapTiles[x][y].pos.y = y
    })

    this.map = new Map({ mapTiles: mapTiles })

    this.map.addEntityAtRndFloorTilePos(Game.instance.player)

    for (let i = 0; i < 1000; i++) {
      this.map.addEntityAtRndFloorTilePos(
        EntityFactory.instance.createKoboldEntity()
      )
    }

    this.map.engine.start()
  }

  exit(): void {
    console.log('exit WinScene')
  }

  render(display: RotDisplay): void {
    const displayWidth = Game.instance.viewDisplay._options.width - 2
    const displayHeight = Game.instance.viewDisplay._options.height - 2
    const mapWidth = this.map?.width ?? 0
    const mapHeight = this.map?.height ?? 0

    const playerPosition = Game.instance.player.getComponent(
      Components.TransformComponent
    ).position

    let rootX = Math.max(0, playerPosition.x - displayWidth / 2)
    rootX = Math.min(rootX, mapWidth - displayWidth)

    let rootY = Math.max(0, playerPosition.y - displayHeight / 2)
    rootY = Math.min(rootY, mapHeight - displayHeight)

    for (let x = rootX; x < rootX + displayWidth; x++) {
      for (let y = rootY; y < rootY + displayHeight; y++) {
        const glyph = this.map?.getTileAt(x, y).tile.glyph
        display.draw(
          x - rootX + 1,
          y - rootY + 1,
          glyph?.symbol ?? Glyph.errorSymbol,
          glyph?.fgColor ?? Glyph.errorFgColor,
          glyph?.bgColor ?? Glyph.errorBgColor
        )
      }
    }

    const lineDebug = this.map?.getTilesAlongLine(0, 0, 20, 20)
    console.log(lineDebug?.length)
    lineDebug?.forEach((tile) => {
      display.draw(
        tile.pos.x - rootX + 1,
        tile.pos.y - rootY + 1,
        '!',
        'yellow',
        tile.tile.glyph?.bgColor ?? Glyph.errorBgColor
      )
    })

    const radiusDebug = this.map?.getTilesInRadius(30, 10, 10)
    console.log(radiusDebug?.length)
    radiusDebug?.forEach((tile) => {
      display.draw(
        tile.pos.x - rootX + 1,
        tile.pos.y - rootY + 1,
        'X',
        'green',
        tile.tile.glyph?.bgColor ?? Glyph.errorBgColor
      )
    })

    this.map?.entities.forEach((entity: Entity) => {
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
          this.map?.engine.unlock()
          break

        case RotKeys.VK_RIGHT:
          this.movePlayer(1, 0)
          this.map?.engine.unlock()
          break

        case RotKeys.VK_UP:
          this.movePlayer(0, -1)
          this.map?.engine.unlock()
          break

        case RotKeys.VK_DOWN:
          this.movePlayer(0, 1)
          this.map?.engine.unlock()
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
    if (this.map) {
      playerTransform.tryMove(newX, newY, this.map)
    }
  }
}
