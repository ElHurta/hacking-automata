import { AbstractMesh, Vector3 } from "@babylonjs/core";
import { MovingEntity } from "yuka";
import SceneEntity from "./SceneEntity";

export default class Player extends SceneEntity {
  constructor(
    name: string,
    meshes: AbstractMesh[],
    spawnPosition: Vector3,
    movingEntity: MovingEntity = new MovingEntity(),
    lifePoints: number = 3,
    movementSpeed: number = 0.7,
    private _shootingDelay: number = 150,
    private _lastShotTime: number = 0,
  ) {
    super(
      name,
      "cutePlayer",
      meshes,
      spawnPosition,
      movingEntity,
      lifePoints,
      movementSpeed,
    );
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
}
