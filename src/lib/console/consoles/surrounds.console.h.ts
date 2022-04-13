import { Display as RotDisplay } from 'rot-js'

import { SurroundsConsoleDispOpt } from '@/display.config'
import { Console } from '@/lib/console'
import { Components } from '@/lib/ecs'
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
      const playerTransform = Game.instance.player.getComponent(
        Components.TransformComponent
      )

      const tileTypesInFov = dungeon.getTileTypesInFov(
        playerTransform.position.z
      )

      tileTypesInFov.sort((a, b) => {
        return a < b ? -1 : a > b ? 1 : 0
      })

      const renderTiles: Tile[] = []
      tileTypesInFov.forEach((type) => {
        renderTiles.push(Tiles[type])
      })

      for (let i = 0; i < renderTiles.length; i++) {
        const glyph = renderTiles[i].glyph
        this.display.draw(1, i + 1, glyph.symbol, glyph.fgColor, glyph.bgColor)
        this.display.drawText(3, i + 1, renderTiles[i].type)
      }

      const entitiesInFov = dungeon.getEntitiesInFov(playerTransform.position.z)

      entitiesInFov.sort((a, b) => {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
      })

      for (let i = 0; i < entitiesInFov.length; i++) {
        const entity = entitiesInFov[i]
        if (entity.name !== 'Player') {
          const glyph = entity.glyph
          this.display.draw(
            1,
            i + renderTiles.length + 2,
            glyph.symbol,
            glyph.fgColor,
            glyph.bgColor
          )
          this.display.drawText(3, i + renderTiles.length + 2, entity.name)
          const entityHealth = entity.getComponent(Components.HealthComponent)
          if (entityHealth) {
            this.display.drawText(
              4 + entity.name.length,
              i + renderTiles.length + 2,
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
