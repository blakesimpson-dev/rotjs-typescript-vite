import { Position } from '@/lib/common'
import { Component, Components, Entity } from '@/lib/ecs'
import { TileMap } from '@/lib/map'

export class TransformComponent implements Component {
  readonly name = 'Transform'
  readonly tags = []
  position: Position

  constructor(public entity: Entity) {
    this.position = Position.zero()
  }

  tryMove(x: number, y: number, map: TileMap): boolean {
    let success = false
    const tile = map.getTileAt(x, y)
    const target = map.getFirstEntityAt(x, y)
    console.log(x, y)
    console.log(tile.position)

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
      map.destructTile(x, y)
      success = true
    }
    return success
  }
}
