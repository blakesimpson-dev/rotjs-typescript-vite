import { Biome } from '@/lib/common'
import { Tiles } from '@/lib/tile'

export class BiomeSystem {
  private static _instance: BiomeSystem
  private _currentBiome: Biome

  constructor() {
    this._currentBiome = undefined
  }

  get currentBiome(): Biome {
    return this._currentBiome
  }

  set currentBiome(biome: Biome) {
    console.log(`BiomeSystem.instance.currentBiome set to ${biome}`)
    this._currentBiome = biome
    Tiles.setBoundsGlyphForBiome(this._currentBiome)
    Tiles.setFloorGlyphForBiome(this._currentBiome)
    Tiles.setWallGlyphForBiome(this._currentBiome)
  }

  static get instance(): BiomeSystem {
    if (!BiomeSystem._instance) {
      BiomeSystem._instance = new BiomeSystem()
    }

    return BiomeSystem._instance
  }
}
