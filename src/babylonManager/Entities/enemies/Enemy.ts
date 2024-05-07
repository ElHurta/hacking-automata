import { AbstractMesh, Vector3 } from "@babylonjs/core";
import SceneEntity from "../SceneEntity";
import { MovingEntity } from "yuka";

export default class Enemy extends SceneEntity {
  protected shootingFunc : (() => void) | undefined;
  
  constructor(
    name: string,
    concreteName: string,
    meshes: AbstractMesh[],
    spawnPosition: Vector3,
    movingEntity: MovingEntity = new MovingEntity(),
    lifePoints: number = 30,
    movementSpeed: number = 30,
  ) {
    super(name, concreteName, meshes, spawnPosition, movingEntity, lifePoints, movementSpeed);
  }

  public get shootingFunction(): (() => void) | undefined {
    return this.shootingFunc;
  }

  public set shootingFunction(func: () => void) {
    this.shootingFunc = func;
  }
}
