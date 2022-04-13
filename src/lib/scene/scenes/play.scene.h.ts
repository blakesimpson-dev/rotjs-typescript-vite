import {
  Color as RotColor,
  Display as RotDisplay,
  KEYS as RotKeys,
} from 'rot-js'

import { Vector3 } from '@/lib/common'
import { Dungeon, DungeonBuilder } from '@/lib/dungeon'
import { Components, EntityFactory } from '@/lib/ecs'
import { Game } from '@/lib/game'
import { Glyph } from '@/lib/glyph'
import { Scene, SceneFactory } from '@/lib/scene'

export class PlayScene implements Scene {
  dungeon: Dungeon | null = null

  enter(): void {
    const width = 76
    const height = 76
    const depth = 6

    const tiles = new DungeonBuilder({
      width: width,
      height: height,
      depth: depth,
    }).tiles

    this.dungeon = new Dungeon({
      tiles: tiles,
    })

    this.dungeon.addEntityAtRndFloorTilePos(Game.instance.player, 0)

    for (let z = 0; z < this.dungeon.depth; z++) {
      for (let i = 0; i < 20; i++) {
        this.dungeon.addEntityAtRndFloorTilePos(
          EntityFactory.instance.createKoboldEntity(),
          z
        )
      }
    }

    this.dungeon.engine.start()
  }

  exit(): void {
    console.log('exit WinScene')
  }

  render(display: RotDisplay): void {
    const displayWidth = display._options.width - 2
    const displayHeight = display._options.height - 2
    const mapWidth = this.dungeon?.width ?? 0
    const mapHeight = this.dungeon?.height ?? 0

    const player = Game.instance.player

    const playerPosition = player.getComponent(
      Components.TransformComponent
    ).position

    const playerSight = player.getComponent(Components.SightComponent)

    let rootX = Math.max(0, playerPosition.x - displayWidth / 2)
    rootX = Math.min(rootX, mapWidth - displayWidth)

    let rootY = Math.max(0, playerPosition.y - displayHeight / 2)
    rootY = Math.min(rootY, mapHeight - displayHeight)

    this.dungeon?.updateFov(
      {
        x: playerPosition.x,
        y: playerPosition.y,
        z: playerPosition.z,
      },
      playerSight.sightValue
    )

    for (let x = rootX; x < rootX + displayWidth; x++) {
      for (let y = rootY; y < rootY + displayHeight; y++) {
        if (this.dungeon?.isExplored({ x: x, y: y, z: playerPosition.z })) {
          const glyph = this.dungeon?.getTileAt({
            x: x,
            y: y,
            z: playerPosition.z,
          }).glyph
          const rgbColor = RotColor.fromString(
            glyph?.fgColor ?? Glyph.errorFgColor
          )
          const darkenedColor = RotColor.toHex(
            RotColor.multiply(rgbColor, [50, 50, 50])
          )
          display.draw(
            x - rootX + 1,
            y - rootY + 1,
            glyph?.symbol ?? Glyph.errorSymbol,
            darkenedColor,
            glyph?.bgColor ?? Glyph.errorBgColor
          )
        }
      }
    }

    for (let x = rootX; x < rootX + displayWidth; x++) {
      for (let y = rootY; y < rootY + displayHeight; y++) {
        if (this.dungeon?.visibleTiles[`${x},${y}`]) {
          const glyph = this.dungeon?.getTileAt({
            x: x,
            y: y,
            z: playerPosition.z,
          }).glyph
          display.draw(
            x - rootX + 1,
            y - rootY + 1,
            glyph?.symbol ?? Glyph.errorSymbol,
            glyph?.fgColor ?? Glyph.errorFgColor,
            glyph?.bgColor ?? Glyph.errorBgColor
          )
        }
      }
    }

    const entities = this.dungeon?.entities
    for (const key in entities) {
      const entity = entities[key]
      const entityPosition = entity.getComponent(
        Components.TransformComponent
      ).position
      if (
        entityPosition.x >= rootX &&
        entityPosition.y >= rootY &&
        entityPosition.x < rootX + displayWidth &&
        entityPosition.y < rootY + displayHeight &&
        entityPosition.z === playerPosition.z
      ) {
        if (
          this.dungeon?.visibleTiles[`${entityPosition.x},${entityPosition.y}`]
        ) {
          display.draw(
            entityPosition.x - rootX + 1,
            entityPosition.y - rootY + 1,
            entity.glyph.symbol,
            entity.glyph.fgColor,
            entity.glyph.bgColor
          )
        }
      }
    }
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
          this.movePlayer({ x: -1, y: 0, z: 0 })
          this.dungeon?.engine.unlock()
          break

        case RotKeys.VK_RIGHT:
          this.movePlayer({ x: 1, y: 0, z: 0 })
          this.dungeon?.engine.unlock()
          break

        case RotKeys.VK_UP:
          this.movePlayer({ x: 0, y: -1, z: 0 })
          this.dungeon?.engine.unlock()
          break

        case RotKeys.VK_DOWN:
          this.movePlayer({ x: 0, y: 1, z: 0 })
          this.dungeon?.engine.unlock()
          break

        default:
          break
      }
    } else if (eventType === 'keypress') {
      const keyChar = String.fromCharCode(event.charCode)
      switch (keyChar) {
        case '>':
          this.movePlayer({ x: 0, y: 0, z: 1 })
          this.dungeon?.engine.unlock()
          break

        case '<':
          this.movePlayer({ x: 0, y: 0, z: -1 })
          this.dungeon?.engine.unlock()
          break

        default:
          break
      }
    }
  }

  private movePlayer(destination: Vector3): void {
    const playerTransform = Game.instance.player.getComponent(
      Components.TransformComponent
    )

    if (this.dungeon) {
      playerTransform.tryMove({
        x: playerTransform.position.x + destination.x,
        y: playerTransform.position.y + destination.y,
        z: playerTransform.position.z + destination.z,
      })
    }
  }
}
