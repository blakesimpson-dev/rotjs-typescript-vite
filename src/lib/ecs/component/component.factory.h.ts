import { Component, Components, Entity } from '@/lib/ecs'

export class ComponentFactory {
  private static _instance: ComponentFactory

  createActorComponent(entity: Entity): Component {
    return new Components.ActorComponent(entity)
  }

  createAttackComponent(
    entity: Entity,
    initAttackValue?: number,
    initHitChance?: number
  ): Component {
    return new Components.AttackComponent(
      entity,
      initAttackValue,
      initHitChance
    )
  }

  createSightComponent(entity: Entity): Component {
    return new Components.SightComponent(entity)
  }

  createDefenceComponent(entity: Entity, initDefenceValue?: number): Component {
    return new Components.DefenceComponent(entity, initDefenceValue)
  }

  createDodgeComponent(entity: Entity, initDodgeChance?: number): Component {
    return new Components.DodgeComponent(entity, initDodgeChance)
  }

  createHealthComponent(entity: Entity, initMaxHpValue?: number): Component {
    return new Components.HealthComponent(entity, initMaxHpValue)
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
