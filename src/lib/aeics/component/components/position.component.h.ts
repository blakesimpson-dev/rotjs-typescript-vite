import { Component, Entity } from '@/lib/aeics'
import { Vector3 } from '@/lib/common'

export class PositionComponent implements Component {
  readonly name = 'Position'
  readonly tags = []
  position: Vector3

  constructor(public entity: Entity) {
    this.position = { x: 0, y: 0, z: 0 }
  }
}
