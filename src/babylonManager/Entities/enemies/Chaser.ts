import { AbstractMesh, Vector3 } from "@babylonjs/core";
import Enemy from "./Enemy";
import { MovingEntity } from "yuka";

export default class Chaser extends Enemy {
  constructor(
    meshes: AbstractMesh[],
    spawnPosition: Vector3,
    name = "Chaser",
    movingEntity: MovingEntity = new MovingEntity(),
    lifePoints: number = 30,
    movementSpeed: number = 15,
    private _hasArmor: boolean = false,
  ) {
    super(name, meshes, spawnPosition, movingEntity, lifePoints, movementSpeed);
  }

  public get hasArmor(): boolean {
    return this._hasArmor;
  }
}
