export class Position {
  constructor(public x: number, public y: number) {}

  static zero(): Position {
    return new Position(0, 0)
  }
}
