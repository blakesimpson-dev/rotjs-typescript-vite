import { Entities, Entity, EntityCatalog } from '@/lib/ecs'

export class EntityFactory {
  private static _instance: EntityFactory
  readonly entityCatalog: EntityCatalog

  constructor() {
    this.entityCatalog = {
      player: new Entities.PlayerEntity(),
    }
  }

  createKoboldEntity(): Entity {
    return new Entities.KoboldEntity()
  }

  static get instance(): EntityFactory {
    if (!EntityFactory._instance) {
      EntityFactory._instance = new EntityFactory()
    }

    return EntityFactory._instance
  }
}
