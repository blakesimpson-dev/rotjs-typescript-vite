import { Position } from '@/lib/common'
import { Component, Components, Entity } from '@/lib/ecs'
import { TileMap } from '@/lib/tilemap'

export class TransformComponent implements Component {
  readonly name = 'Transform'
  readonly tags = []
  position: Position

  constructor(public entity: Entity) {
    this.position = Position.zero()
  }

  tryMove(x: number, y: number, tileMap: TileMap): boolean {
    let success = false
    const tile = tileMap.getTileAt(x, y)
    const target = tileMap.getFirstEntityAt(x, y)

    if (target) {
      if (this.entity.hasComponent(Components.AttackComponent)) {
        const entityAttack = this.entity.getComponent(
          Components.AttackComponent
        )
        entityAttack.performAttack(target)
      }
      success = false
    } else if (!tile.isCollider) {
      this.position.x = x
      this.position.y = y
      success = true
    } else if (tile.isDestructable) {
      tileMap.destructTile(x, y)
      success = true
    }
    return success
  }
}
