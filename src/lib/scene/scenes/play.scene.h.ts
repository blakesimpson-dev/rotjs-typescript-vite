import {
  Color as RotColor,
  Display as RotDisplay,
  KEYS as RotKeys,
} from 'rot-js'

import {
  Components,
  EntityFactory,
  InputSystem,
  ItemFactory,
  RenderSystem,
} from '@/lib/aeics'
import { Vector3 } from '@/lib/common'
import { Dungeon, DungeonBuilder } from '@/lib/dungeon'
import { Game } from '@/lib/game'
import { Glyph } from '@/lib/glyph'
import { Scene, SceneFactory } from '@/lib/scene'

export class PlayScene implements Scene {
  dungeon: Dungeon | null = null
  flags: Record<string, boolean> = {
    isPlayerDead: false,
  }

  setFlag(key: string, value: boolean): void {
    const existingKeys = Object.keys(this.flags)
    if (existingKeys.indexOf(key) === -1) {
      throw new Error(
        `setFlag(key: ${key}, value: ${value}): Cannot set flag that does not exist`
      )
    } else {
      this.flags[key] = value
    }
  }

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
    // todo remove this later
    // for (let i = 0; i < 4; i++) {
    //   Game.instance.player
    //     .getComponent(Components.InventoryComponent)
    //     .addItem(ItemFactory.instance.createAppleItem())
    // }

    for (let z = 0; z < this.dungeon.depth; z++) {
      for (let i = 0; i < 20; i++) {
        this.dungeon.addEntityAtRndFloorTilePos(
          EntityFactory.instance.createKoboldEntity(),
          z
        )
      }
      for (let i = 0; i < 20; i++) {
        this.dungeon.addItemAtRndFloorTilePos(
          ItemFactory.instance.createAppleItem(),
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
        const iteratedPos: Vector3 = { x: x, y: y, z: playerPosition.z }
        // has the iteratedPos been explored ?
        if (this.dungeon?.isExplored(iteratedPos)) {
          // if the position has been explored, set glyph as the tile's glyph
          let glyph = this.dungeon?.getTileAt(iteratedPos).glyph
          // is the iteratedPos in the player's FOV ?
          if (this.dungeon?.visibleTiles[`${x},${y}`]) {
            // fetch items from the iteratedPos and set glyph as the last item's glyph
            const items = this.dungeon.getItemsAt(iteratedPos)
            if (items) {
              glyph = items[items.length - 1].glyph
            }
            // fetch entity from the iteratedPos and set glyph as the entity's glyph
            const entity = this.dungeon.getEntityAt(iteratedPos)
            if (entity) {
              glyph = entity.glyph
            }
          } else {
            // the iteratedPos has been explored but is not in the player's FOV
            // create darkenedColor and new Glyph
            const rgbColor = RotColor.fromString(
              glyph?.fgColor ?? Glyph.errorFgColor
            )
            const darkenedColor = RotColor.toHex(
              RotColor.multiply(rgbColor, [50, 50, 50])
            )
            glyph = new Glyph({
              symbol: glyph?.symbol ?? Glyph.errorSymbol,
              fgColor: darkenedColor,
              bgColor: glyph?.bgColor ?? Glyph.errorBgColor,
            })
          }
          // draw the glyph
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
  }

  processInputEvent(eventType: string, event: KeyboardEvent): void {
    if (this.flags.isPlayerDead) {
      if (eventType === 'keydown' && event.keyCode === RotKeys.VK_RETURN) {
        Game.instance.currentScene = SceneFactory.instance.sceneCatalog.lose
      }
    } else {
      if (eventType === 'keydown') {
        switch (event.keyCode) {
          case RotKeys.VK_ESCAPE:
            RenderSystem.instance.menuConsole.mode = 'Main'
            InputSystem.instance.targetConsole =
              RenderSystem.instance.menuConsole
            break

          case RotKeys.VK_I:
            if (
              !Game.instance.player
                .getComponent(Components.InventoryComponent)
                .getItems().length
            ) {
              RenderSystem.instance.messageConsole.addMessage(
                `You are not carrying anything`
              )
            } else {
              RenderSystem.instance.menuConsole.mode = 'Inventory'
              InputSystem.instance.targetConsole =
                RenderSystem.instance.menuConsole
            }

            break

          case RotKeys.VK_D:
            if (
              !Game.instance.player
                .getComponent(Components.InventoryComponent)
                .getItems().length
            ) {
              RenderSystem.instance.messageConsole.addMessage(
                `You have nothing to drop`
              )
            } else {
              RenderSystem.instance.menuConsole.mode = 'DropItems'
              InputSystem.instance.targetConsole =
                RenderSystem.instance.menuConsole
            }
            break

          case RotKeys.VK_COMMA:
            if (
              !this.dungeon?.getItemsAt(
                Game.instance.player.getComponent(Components.TransformComponent)
                  .position
              )
            ) {
              RenderSystem.instance.messageConsole.addMessage(
                `There is nothing on the ground to pick up`
              )
            } else {
              RenderSystem.instance.menuConsole.mode = 'GetItems'
              InputSystem.instance.targetConsole =
                RenderSystem.instance.menuConsole
            }
            break

          // todo remove this later
          case RotKeys.VK_NUMPAD0:
            Game.instance.player
              .getComponent(Components.HealthComponent)
              .recieveAttack(5)
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
