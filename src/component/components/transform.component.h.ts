import { Position } from '@/common'
import { Component } from '@/component'
import { Entity } from '@/entity'
import { Map } from '@/map'

export class TransformComponent implements Component {
  name = 'Transform'
  tags = []
  position: Position

  constructor(public entity: Entity) {
    this.position = Position.zero()
  }

  translate(x: number, y: number, map: Map): boolean {
    let success = false
    const tile = map.getTileAt(x, y)
    const target = map.getFirstEntityAt(x, y)

    if (target) {
      console.log(`Player collided with ${target.name}`)
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
