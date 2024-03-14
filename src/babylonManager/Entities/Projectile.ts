import { AbstractMesh } from "@babylonjs/core";

export default abstract class Projectile {
  protected _mesh: AbstractMesh | undefined;
  constructor(
    protected _meshName: string,
    protected _shootingDelay: number,
    protected _speed: number,
    protected _damage: number,
    protected _destructible: boolean,
    protected _disposeTime: number,
    protected _isPlayerProjectile: boolean,
  ) {}

  get meshName(): string {
    return this._meshName;
  }

  get mesh(): AbstractMesh {
    return this._mesh as AbstractMesh;
  }

  set mesh(mesh: AbstractMesh) {
    this._mesh = mesh;
  }

  get shootingDelay(): number {
    return this._shootingDelay;
  }

  get speed(): number {
    return this._speed;
  }

  get damage(): number {
    return this._damage;
  }

  get disposeTime(): number {
    return this._disposeTime;
  }

  get isPlayerProjectile(): boolean {
    return this._isPlayerProjectile;
  }
}
