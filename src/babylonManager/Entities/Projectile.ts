export default abstract class Projectile {
  constructor(
    protected _meshName: string,
    protected _shootingDelay: number,
    protected _projectileSpeed: number,
    protected _damage: number,
    protected _destructible: boolean,
  ) {}

  get meshName(): string {
    return this._meshName;
  }

  get SHOOTING_DELAY(): number {
    return this._shootingDelay;
  }
}
