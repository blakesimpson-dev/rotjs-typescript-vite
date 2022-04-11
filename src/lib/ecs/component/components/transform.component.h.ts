import { Vector3 } from '@/lib/common'
import { Component, Components, Entity, RenderSystem } from '@/lib/ecs'

export class TransformComponent implements Component {
  readonly name = 'Transform'
  readonly tags = []
  position: Vector3

  constructor(public entity: Entity) {
    this.position = { x: 0, y: 0, z: 0 }
  }

  tryMove(x: number, y: number, z: number): boolean {
    let success = false
    const dungeon = this.entity.dungeon
    if (!dungeon) {
      success = false
      return success
    }

    const tile = dungeon.getTileAt(x, y, this.position.z)
    const target = dungeon.getFirstEntityAt(x, y, this.position.z)

    if (z < this.position.z) {
      if (tile.type !== 'StairsUp') {
        RenderSystem.instance.messageConsole.addMessage(
          `%c{orange}You can't ascend here...`
        )
      } else {
        RenderSystem.instance.messageConsole.addMessage(
          `%c{orange}You ascended to level ${z + 1}`
        )
        this.position.x = x
        this.position.y = y
        this.position.z = z
        success = true
      }
    } else if (z > this.position.z) {
      if (tile.type !== 'StairsDown') {
        RenderSystem.instance.messageConsole.addMessage(
          `%c{orange}You can't descend here...`
        )
      } else {
        RenderSystem.instance.messageConsole.addMessage(
          `%c{orange}You descended to level ${z + 1}`
        )
        this.position.x = x
        this.position.y = y
        this.position.z = z
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
      this.position.x = x
      this.position.y = y
      this.position.z = z
      success = true
    } else if (tile.isDestructable) {
      dungeon.destructTile(x, y, z)
      success = true
    }
    return success
  }
}
