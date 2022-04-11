import { Color as RotColor, Map as RotMap } from 'rot-js'

import { Vector2, Vector3 } from '@/lib/common'
import { DungeonBuilderProps } from '@/lib/dungeon'
import { Glyph } from '@/lib/glyph'
import { Tile, Tiles } from '@/lib/tile'
import { shuffleArray } from '@/utils'

export class DungeonBuilder {
  readonly _width: number
  readonly _height: number
  readonly _depth: number
  readonly _tiles: Tile[][][]
  readonly _regions: number[][][]

  get tiles(): Tile[][][] {
    return this._tiles
  }

  constructor(props: DungeonBuilderProps) {
    this._width = props.width
    this._height = props.height
    this._depth = props.depth
    this._tiles = new Array<Tile[][]>(this._depth)
    this._regions = new Array<number[][]>(this._depth)

    for (let z = 0; z < this._depth; z++) {
      this._tiles[z] = this.buildZLevel(z)
      this._regions[z] = new Array<number[]>(this._width)
      for (let x = 0; x < this._width; x++) {
        this._regions[z][x] = new Array<number>(this._height)
        for (let y = 0; y < this._height; y++) {
          this._regions[z][x][y] = 0
        }
      }
    }

    // todo this is currently broken - it fills everything with walls :)
    for (let z = 0; z < this._depth; z++) {
      this.setupRegionsForZLevel(z)
    }

    this.connectAllRegions()
  }

  private buildZLevel(z: number): Tile[][] {
    const tiles: Tile[][] = new Array<Tile[]>(this._width)
    for (let w = 0; w < this._width; w++) {
      tiles[w] = new Array<Tile>(this._height)
    }

    const rotGenerator = new RotMap.Cellular(this._width, this._height)
    rotGenerator.randomize(0.5)
    const totalIterations = 3
    for (let i = 0; i < totalIterations; i++) {
      rotGenerator.create()
    }

    rotGenerator.create((x, y, v) => {
      if (v === 1) {
        tiles[x][y] = {
          ...Tiles.Floor,
          glyph: new Glyph({ ...Tiles.Floor.glyph }),
          position: { x: x, y: y, z: z },
        }
      } else {
        tiles[x][y] = {
          ...Tiles.Wall,
          glyph: new Glyph({ ...Tiles.Wall.glyph }),
          position: { x: x, y: y, z: z },
        }
      }
      if (y === 0 || y === this._height - 1) {
        tiles[x][y] = {
          ...Tiles.Bounds,
          glyph: new Glyph({ ...Tiles.Bounds.glyph }),
          position: { x: x, y: y, z: z },
        }
      } else if (x === 0 || x === this._width - 1) {
        tiles[x][y] = {
          ...Tiles.Bounds,
          glyph: new Glyph({ ...Tiles.Bounds.glyph }),
          position: { x: x, y: y, z: z },
        }
      }

      const rndFgColor = RotColor.randomize(
        RotColor.fromString(tiles[x][y].glyph.fgColor),
        [20, 20, 20]
      )
      tiles[x][y].glyph.fgColor = RotColor.toHex(rndFgColor)
    })

    return tiles
  }

  private canFillRegion(x: number, y: number, z: number): boolean {
    if (
      x < 0 ||
      y < 0 ||
      z < 0 ||
      x >= this._width ||
      y >= this._height ||
      z >= this._depth
    ) {
      return false
    }

    if (this._regions[z][x][y] !== 0) {
      return false
    }

    return !this._tiles[z][x][y].isCollider
  }

  private fillRegion(region: number, x: number, y: number, z: number): number {
    let tilesFilled = 1
    let tilePosition: Vector2 | undefined
    let neighbours: Vector2[]
    const tilePositions: Vector2[] = [{ x: x, y: y }]
    this._regions[z][x][y] = region

    while (tilePositions.length > 0) {
      tilePosition = tilePositions.pop()
      if (tilePosition) {
        neighbours = this.getNeighbouringPositions(
          tilePosition.x,
          tilePosition.y
        )
        while (neighbours.length > 0) {
          tilePosition = neighbours.pop()
          if (tilePosition) {
            if (this.canFillRegion(tilePosition.x, tilePosition.y, z)) {
              this._regions[z][tilePosition.x][tilePosition.y] = region
              tilePositions.push(tilePosition)
              tilesFilled++
            }
          }
        }
      }
    }
    return tilesFilled
  }

  private removeRegion(region: number, z: number) {
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        if (this._regions[z][x][y] === region) {
          this._regions[z][x][y] = 0
          this._tiles[z][x][y] = {
            ...Tiles.Wall,
            glyph: new Glyph({
              ...Tiles.Wall.glyph,
              fgColor: RotColor.toHex(
                RotColor.randomize(
                  RotColor.fromString(Tiles.Wall.glyph.fgColor),
                  [15, 15, 15]
                )
              ),
            }),
            position: { x: 0, y: 0, z: z },
          }
        }
      }
    }
  }

  private setupRegionsForZLevel(z: number): void {
    let region = 1
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        if (this.canFillRegion(x, y, z)) {
          if (this.fillRegion(region, x, y, z) <= 20) {
            this.removeRegion(region, z)
          } else {
            region++
          }
        }
      }
    }
  }

  private getRegionOverlapPositions(
    z: number,
    r1: number,
    r2: number
  ): Vector3[] {
    const results = []

    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        if (
          this._tiles[z][x][y].type === 'Floor' &&
          this._tiles[z + 1][x][y].type === 'Floor' &&
          this._regions[z][x][y] === r1 &&
          this._regions[z + 1][x][y] === r2
        ) {
          results.push({ x: x, y: y, z: z })
        }
      }
    }

    return shuffleArray(results)
  }

  private connectRegions(z: number, r1: number, r2: number): boolean {
    const overlapPositions = this.getRegionOverlapPositions(z, r1, r2)
    if (!overlapPositions.length) {
      return false
    }

    const overlapPositon = overlapPositions[0]
    this._tiles[z][overlapPositon.x][overlapPositon.y] = {
      ...Tiles.StairsDown,
      glyph: new Glyph({ ...Tiles.StairsDown.glyph }),
      position: {
        x: overlapPositon.x,
        y: overlapPositon.y,
        z: overlapPositon.z,
      },
    }

    this._tiles[z + 1][overlapPositon.x][overlapPositon.y] = {
      ...Tiles.StairsUp,
      glyph: new Glyph({ ...Tiles.StairsUp.glyph }),
      position: {
        x: overlapPositon.x,
        y: overlapPositon.y,
        z: overlapPositon.z,
      },
    }

    return true
  }

  private connectAllRegions(): void {
    for (let z = 0; z < this._depth - 1; z++) {
      const connected: Record<string, boolean> = {}
      for (let x = 0; x < this._width; x++) {
        for (let y = 0; y < this._height; y++) {
          const key = this._regions[z][x][y] + ',' + this._regions[z + 1][x][y]
          if (
            this._tiles[z][x][y].type === 'Floor' &&
            this._tiles[z + 1][x][y].type === 'Floor' &&
            !connected[key]
          ) {
            if (
              this.connectRegions(
                z,
                this._regions[z][x][y],
                this._regions[z + 1][x][y]
              )
            ) {
              connected[key] = true
            }
          }
        }
      }
    }
  }

  getNeighbouringPositions(x: number, y: number): Vector2[] {
    const results: Vector2[] = []
    for (let dx = -1; dx < 2; dx++) {
      for (let dy = -1; dy < 2; dy++) {
        if (dx === 0 && dy === 0) {
          continue
        }
        results.push({ x: x + dx, y: y + dy })
      }
    }
    return shuffleArray(results)
  }
}
