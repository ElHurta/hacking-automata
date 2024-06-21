import { AbstractMesh, Vector3 } from "@babylonjs/core";

import Enemy from "./Enemy";
import { MovingEntity } from "yuka";

const SHOOTING_DELAY = 600;

export default class Sphere extends Enemy {
  constructor(
    meshes: AbstractMesh[],
    spawnPosition: Vector3,
    concreteName: string,
    name: string = "Sphere",
    movingEntity: MovingEntity = new MovingEntity(),
    lifePoints: number = 10,
    movementSpeed: number = 25,
    shootingPattern: string = "singleNoDesProjectile",
    private _hasShield: boolean = false,
  ) {
    super(name, concreteName, meshes, spawnPosition, movingEntity, lifePoints, movementSpeed, shootingPattern, SHOOTING_DELAY);
  }

  public get hasShield(): boolean {
    return this._hasShield;
  }
}
