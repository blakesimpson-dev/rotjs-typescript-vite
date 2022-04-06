import { Position } from '@/common'
import { Component } from '@/component'
import { Entity } from '@/entity'
import { Map } from '@/map'

export class TransformComponent implements Component {
  name: string

  constructor(public entity: Entity, public position: Position) {
    this.name = 'Transform'
  }

  translate(x: number, y: number, map: Map): boolean {
    let success = false
    const tile = map.getTile(x, y)
    if (!tile.isCollider) {
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
