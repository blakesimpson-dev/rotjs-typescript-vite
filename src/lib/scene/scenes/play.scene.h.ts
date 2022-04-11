import { Display as RotDisplay, KEYS as RotKeys } from 'rot-js'

import { Dungeon, DungeonBuilder } from '@/lib/dungeon'
import { Components, Entity } from '@/lib/ecs'
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

    const playerPosition = Game.instance.player.getComponent(
      Components.TransformComponent
    ).position

    let rootX = Math.max(0, playerPosition.x - displayWidth / 2)
    rootX = Math.min(rootX, mapWidth - displayWidth)

    let rootY = Math.max(0, playerPosition.y - displayHeight / 2)
    rootY = Math.min(rootY, mapHeight - displayHeight)

    for (let x = rootX; x < rootX + displayWidth; x++) {
      for (let y = rootY; y < rootY + displayHeight; y++) {
        const glyph = this.dungeon?.getTileAt(x, y, playerPosition.z).glyph
        display.draw(
          x - rootX + 1,
          y - rootY + 1,
          glyph?.symbol ?? Glyph.errorSymbol,
          glyph?.fgColor ?? Glyph.errorFgColor,
          glyph?.bgColor ?? Glyph.errorBgColor
        )
      }
    }

    this.dungeon?.entities.forEach((entity: Entity) => {
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
          this.movePlayer(-1, 0, 0)
          this.dungeon?.engine.unlock()
          break

        case RotKeys.VK_RIGHT:
          this.movePlayer(1, 0, 0)
          this.dungeon?.engine.unlock()
          break

        case RotKeys.VK_UP:
          this.movePlayer(0, -1, 0)
          this.dungeon?.engine.unlock()
          break

        case RotKeys.VK_DOWN:
          this.movePlayer(0, 1, 0)
          this.dungeon?.engine.unlock()
          break

        default:
          break
      }
    } else if (eventType === 'keypress') {
      const keyChar = String.fromCharCode(event.charCode)
      switch (keyChar) {
        case '>':
          this.movePlayer(0, 0, 1)
          this.dungeon?.engine.unlock()
          break

        case '<':
          this.movePlayer(0, 0, -1)
          this.dungeon?.engine.unlock()
          break

        default:
          break
      }
    }
  }

  private movePlayer(dX: number, dY: number, dZ: number): void {
    const playerTransform = Game.instance.player.getComponent(
      Components.TransformComponent
    )

    const newX = playerTransform.position.x + dX
    const newY = playerTransform.position.y + dY
    const newZ = playerTransform.position.z + dZ

    if (this.dungeon) {
      playerTransform.tryMove(newX, newY, newZ)
    }
  }
}
