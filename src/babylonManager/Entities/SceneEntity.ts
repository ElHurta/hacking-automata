import { AbstractMesh, Vector3 } from "@babylonjs/core";
import { MovingEntity } from "yuka";

export default abstract class SceneEntity {
  constructor(
    protected _name: string = "",
    protected _concreteName: string = "",
    protected _meshes: AbstractMesh[] = [],
    protected _spawnPosition: Vector3,
    protected _movingEntity?: MovingEntity,
    protected _lifePoints?: number,
    protected _movementSpeed?: number,
  ) {}

  public get name(): string {
    return this._name;
  }

  public get concreteName(): string {
    return this._concreteName;
  }

  public get meshes(): AbstractMesh[] {
    return this._meshes;
  }

  public set meshes(meshes: AbstractMesh[]) {
    this._meshes = meshes;
  }

  public get spawnPosition(): Vector3 {
    return this._spawnPosition;
  }

  public get movingEntity(): MovingEntity {
    return this._movingEntity as MovingEntity;
  }

  public get lifePoints(): number {
    return this._lifePoints as number;
  }

  public set lifePoints(lifePoints: number) {
    this._lifePoints = lifePoints;
  }

  public get movementSpeed(): number {
    return this._movementSpeed as number;
  }
}
