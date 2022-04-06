import { Entities, Entity, EntityCatalog } from '@/entity'

export class EntityFactory {
  private static _instance: EntityFactory
  readonly entityCatalog: EntityCatalog

  constructor() {
    this.entityCatalog = {
      player: new Entities.PlayerEntity(),
    }
  }

  createKobold(): Entity {
    return new Entities.KoboldEntity()
  }

  static get instance(): EntityFactory {
    if (!EntityFactory._instance) {
      EntityFactory._instance = new EntityFactory()
    }

    return EntityFactory._instance
  }
}