export default abstract class Projectile {
  constructor(
    protected _meshName: string,
    protected _shootingDelay: number,
    protected _speed: number,
    protected _damage: number,
    protected _destructible: boolean,
    protected _disposeTime: number,
  ) {}

  get meshName(): string {
    return this._meshName;
  }

  get shootingDelay(): number {
    return this._shootingDelay;
  }

  get speed(): number {
    return this._speed;
  }

  get disposeTime(): number {
    return this._disposeTime;
  }
}
