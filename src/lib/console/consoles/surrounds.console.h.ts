import { Display as RotDisplay } from 'rot-js'

import { SurroundsConsoleDispOpt } from '@/display.config'
import { Components } from '@/lib/aeics'
import { Console } from '@/lib/console'
import { Game } from '@/lib/game'
import { Tile, Tiles } from '@/lib/tile'
import { drawRect } from '@/utils'

export class SurroundsConsole implements Console {
  readonly display: RotDisplay
  readonly container: HTMLElement | null

  constructor() {
    this.display = new RotDisplay(SurroundsConsoleDispOpt)
    this.container = this.display.getContainer()
  }

  render(): void {
    const dungeon = Game.instance.currentScene.dungeon
    if (dungeon) {
      const playerPosition = Game.instance.player.getComponent(
        Components.TransformComponent
      ).position

      const tileTypesInFov = dungeon.getTileTypesInFov(playerPosition.z)

      tileTypesInFov.sort((a, b) => {
        return a < b ? -1 : a > b ? 1 : 0
      })

      const renderTiles: Tile[] = []
      tileTypesInFov.forEach((type) => {
        renderTiles.push(Tiles[type])
      })

      let drawOffsetY = 1

      for (let i = 0; i < renderTiles.length; i++) {
        const glyph = renderTiles[i].glyph
        this.display.draw(
          1,
          i + drawOffsetY,
          glyph.symbol,
          glyph.fgColor,
          glyph.bgColor
        )
        this.display.drawText(3, i + drawOffsetY, renderTiles[i].type)
      }

      const itemsInFov = dungeon.getItemsInFov(playerPosition.z)

      itemsInFov.sort((a, b) => {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
      })

      drawOffsetY = renderTiles.length + 1

      for (let i = 0; i < itemsInFov.length; i++) {
        const item = itemsInFov[i]
        const glyph = item.glyph
        this.display.draw(
          1,
          i + drawOffsetY,
          glyph.symbol,
          glyph.fgColor,
          glyph.bgColor
        )
        this.display.drawText(3, i + drawOffsetY, item.name)
      }

      const entitiesInFov = dungeon.getEntitiesInFov(playerPosition.z)

      entitiesInFov.sort((a, b) => {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
      })

      drawOffsetY = renderTiles.length + itemsInFov.length + 1

      for (let i = 0; i < entitiesInFov.length; i++) {
        const entity = entitiesInFov[i]
        if (entity.name !== 'Player') {
          const glyph = entity.glyph
          this.display.draw(
            1,
            i + drawOffsetY,
            glyph.symbol,
            glyph.fgColor,
            glyph.bgColor
          )
          this.display.drawText(3, i + drawOffsetY, entity.name)
          const entityHealth = entity.getComponent(Components.HealthComponent)
          if (entityHealth) {
            this.display.drawText(
              4 + entity.name.length,
              i + drawOffsetY,
              `HP: ${entityHealth.hpValue}/${entityHealth.maxHpValue}`
            )
          }
        }
      }
    }

    drawRect(
      this.display,
      {
        width: this.display._options.width,
        height: this.display._options.height,
        offsetX: 0,
        offsetY: 0,
      },
      'Surrounds',
      '#716391'
    )
  }
}
