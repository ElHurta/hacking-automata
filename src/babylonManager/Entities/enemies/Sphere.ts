import { AbstractMesh, Vector3 } from "@babylonjs/core";

import Enemy from "./Enemy";
import { MovingEntity } from "yuka";

export default class Sphere extends Enemy {
  constructor(
    meshes: AbstractMesh[],
    spawnPosition: Vector3,
    concreteName: string,
    name: string = "Sphere",
    movingEntity: MovingEntity = new MovingEntity(),
    lifePoints: number = 60,
    movementSpeed: number = 30,
    private _hasShield: boolean = false,
  ) {
    super(name, concreteName, meshes, spawnPosition, movingEntity, lifePoints, movementSpeed);
  }

  public get hasShield(): boolean {
    return this._hasShield;
  }
}
