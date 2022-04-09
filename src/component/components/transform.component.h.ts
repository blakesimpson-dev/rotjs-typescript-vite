import { Position } from '@/common'
import { Component, Components } from '@/component'
import { Entity } from '@/entity'
import { Map } from '@/map'

export class TransformComponent implements Component {
  name = 'Transform'
  tags = []
  position: Position

  constructor(public entity: Entity) {
    this.position = Position.zero()
  }

  tryMove(x: number, y: number, map: Map): boolean {
    let success = false
    const tile = map.getTileAt(x, y)
    const target = map.getFirstEntityAt(x, y)

    if (target) {
      if (this.entity.hasComponent(Components.AttackComponent)) {
        const entityAttack = this.entity.getComponent(
          Components.AttackComponent
        )
        entityAttack.performAttack(target)
      }
      success = false
    } else if (!tile.tile.isCollider) {
      this.position.x = x
      this.position.y = y
      success = true
    } else if (tile.tile.isDestructable) {
      map.destructTile(x, y)
      success = true
    }
    return success
  }
}
