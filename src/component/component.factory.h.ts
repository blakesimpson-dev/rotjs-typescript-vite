import { Component, Components } from '@/component'
import { Entity } from '@/entity'

export class ComponentFactory {
  private static _instance: ComponentFactory

  createTransform(entity: Entity): Component {
    return new Components.TransformComponent(entity)
  }

  createActor(entity: Entity): Component {
    return new Components.ActorComponent(entity)
  }

  static get instance(): ComponentFactory {
    if (!ComponentFactory._instance) {
      ComponentFactory._instance = new ComponentFactory()
    }

    return ComponentFactory._instance
  }
}
