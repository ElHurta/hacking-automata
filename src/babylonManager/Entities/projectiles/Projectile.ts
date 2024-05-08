import { AbstractMesh, Vector3 } from "@babylonjs/core";

export default abstract class Projectile {
  protected _mesh: AbstractMesh | undefined;
  protected _movementFunc: () => void = () => {
    if (this._mesh) {
      this._mesh.position.addInPlace(this._direction.scale(this._speed));
    }
  };

  constructor(
    protected _meshName: string,
    protected _speed: number,
    protected _direction: Vector3,
    protected _damage: number,
    protected _destructible: boolean,
    protected _isPlayerProjectile: boolean,
    protected _disposeTime: number = 3000,
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

  get movementFunc(): () => void {
    return this._movementFunc;
  }

  set movementFunc(func: () => void) {
    this._movementFunc = func;
  }
}
