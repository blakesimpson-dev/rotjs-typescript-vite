import { Component, Components } from '@/component'
import { Entity } from '@/entity'

export class ComponentFactory {
  private static _instance: ComponentFactory

  createActorComponent(entity: Entity): Component {
    return new Components.ActorComponent(entity)
  }

  createAttackComponent(entity: Entity): Component {
    return new Components.AttackComponent(entity)
  }

  createHealthComponent(entity: Entity): Component {
    return new Components.HealthComponent(entity)
  }

  createTransformComponent(entity: Entity): Component {
    return new Components.TransformComponent(entity)
  }

  static get instance(): ComponentFactory {
    if (!ComponentFactory._instance) {
      ComponentFactory._instance = new ComponentFactory()
    }

    return ComponentFactory._instance
  }
}
