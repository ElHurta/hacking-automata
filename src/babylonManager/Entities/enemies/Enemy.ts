import { AbstractMesh, Vector3 } from "@babylonjs/core";
import SceneEntity from "../SceneEntity";
import { MovingEntity } from "yuka";
import { projectileType } from "../../../enums/projectileType.enum";

export default class Enemy extends SceneEntity {
  protected shootingFunc: (() => void) | undefined;

  constructor(
    name: string,
    concreteName: string,
    meshes: AbstractMesh[],
    spawnPosition: Vector3,
    movingEntity: MovingEntity = new MovingEntity(),
    lifePoints: number = 30,
    movementSpeed: number = 30,
    protected _shootingPattern: string,
    protected _projectileType: projectileType,
    protected _shootingDelay: number,
    protected _lastShotTime: number = 0,
  ) {
    super(
      name,
      concreteName,
      meshes,
      spawnPosition,
      movingEntity,
      lifePoints,
      movementSpeed,
    );
    this.movingEntity.position.set(
      spawnPosition.x,
      spawnPosition.y,
      spawnPosition.z,
    );
  }

  public get shootingFunction(): (() => void) | undefined {
    return this.shootingFunc;
  }

  public set shootingFunction(func: () => void) {
    this.shootingFunc = func;
  }

  public get shootingDelay(): number {
    return this._shootingDelay;
  }

  public get lastShotTime(): number {
    return this._lastShotTime;
  }

  public set lastShotTime(time: number) {
    this._lastShotTime = time;
  }

  public get shootingPattern(): string {
    return this._shootingPattern;
  }

  public set shootingPattern(pattern: string) {
    this._shootingPattern = pattern;
  }

  public get projectileType(): projectileType {
    return this._projectileType;
  }
}
