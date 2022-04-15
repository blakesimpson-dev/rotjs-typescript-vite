import { Action, Component, Components, Entity } from '@/lib/aeics'

export class ComponentFactory {
  private static _instance: ComponentFactory

  createActorComponent(entity: Entity, actions: Action[]): Component {
    return new Components.ActorComponent(entity, actions)
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

  createDefenceComponent(entity: Entity, initDefenceValue?: number): Component {
    return new Components.DefenceComponent(entity, initDefenceValue)
  }

  createDodgeComponent(entity: Entity, initDodgeChance?: number): Component {
    return new Components.DodgeComponent(entity, initDodgeChance)
  }

  createHealthComponent(entity: Entity, initMaxHpValue?: number): Component {
    return new Components.HealthComponent(entity, initMaxHpValue)
  }

  createInventoryComponent(entity: Entity, initSlotCount?: number): Component {
    return new Components.InventoryComponent(entity, initSlotCount)
  }

  createPositionComponent(entity: Entity): Component {
    return new Components.PositionComponent(entity)
  }

  createSightComponent(entity: Entity): Component {
    return new Components.SightComponent(entity)
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
