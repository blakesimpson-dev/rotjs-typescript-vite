import { Action, Components, Entity } from '@/lib/aeics'

export class WanderAction implements Action {
  readonly name = 'Wander'

  constructor(public entity: Entity) {}

  performAction(): void {
    const entityTransform = this.entity?.getComponent(
      Components.TransformComponent
    )
    const entityPosition = entityTransform?.position
    if (entityTransform && entityPosition) {
      const moveOffset = Math.round(Math.random()) === 1 ? 1 : -1
      if (Math.round(Math.random()) === 1) {
        entityTransform.tryMove({
          x: entityPosition.x + moveOffset,
          y: entityPosition.y,
          z: entityPosition.z,
        })
      } else {
        entityTransform.tryMove({
          x: entityPosition.x,
          y: entityPosition.y + moveOffset,
          z: entityPosition.z,
        })
      }
    }
  }
}
