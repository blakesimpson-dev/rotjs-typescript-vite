import { Vector3 } from '@/lib/common'
import { Component, Components, Entity, RenderSystem } from '@/lib/ecs'

export class TransformComponent implements Component {
  readonly name = 'Transform'
  readonly tags = []
  position: Vector3

  constructor(public entity: Entity) {
    this.position = { x: 0, y: 0, z: 0 }
  }

  tryMove(destination: Vector3): boolean {
    let success = false
    const dungeon = this.entity.dungeon
    if (!dungeon) {
      success = false
      return success
    }

    const tile = dungeon.getTileAt({
      x: destination.x,
      y: destination.y,
      z: this.position.z,
    })
    const target = dungeon.getEntityAt({
      x: destination.x,
      y: destination.y,
      z: this.position.z,
    })

    if (destination.z < this.position.z) {
      if (tile.type !== 'StairsUp') {
        RenderSystem.instance.messageConsole.addMessage(
          `%c{orange}You can't ascend here...`
        )
      } else {
        RenderSystem.instance.messageConsole.addMessage(
          `%c{orange}You ascended to level ${destination.z + 1}`
        )
        this.setPosition({
          x: destination.x,
          y: destination.y,
          z: destination.z,
        })
        success = true
      }
    } else if (destination.z > this.position.z) {
      if (tile.type !== 'StairsDown') {
        RenderSystem.instance.messageConsole.addMessage(
          `%c{orange}You can't descend here...`
        )
      } else {
        RenderSystem.instance.messageConsole.addMessage(
          `%c{orange}You descended to level ${destination.z + 1}`
        )
        this.setPosition({
          x: destination.x,
          y: destination.y,
          z: destination.z,
        })
        success = true
      }
    } else if (target) {
      if (this.entity.hasComponent(Components.AttackComponent)) {
        const entityAttack = this.entity.getComponent(
          Components.AttackComponent
        )
        entityAttack.performAttack(target)
      }
      success = false
    } else if (!tile.isCollider) {
      this.setPosition({ x: destination.x, y: destination.y, z: destination.z })
      success = true
    } else if (tile.isDestructable) {
      dungeon.destructTile({
        x: destination.x,
        y: destination.y,
        z: destination.z,
      })
      success = true
    }
    return success
  }

  setPosition(newPosition: Vector3): void {
    const oldX = this.position.x
    const oldY = this.position.y
    const oldZ = this.position.z
    this.position.x = newPosition.x
    this.position.y = newPosition.y
    this.position.z = newPosition.z
    this.entity.dungeon?.updateEntityPosition(this.entity, oldX, oldY, oldZ)
  }
}
