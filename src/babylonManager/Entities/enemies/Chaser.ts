import { AbstractMesh, Vector3 } from "@babylonjs/core";
import Enemy from "./Enemy";
import { MovingEntity } from "yuka";

const SHOOTING_DELAY = 600;

export default class Chaser extends Enemy {

  constructor(
    meshes: AbstractMesh[],
    spawnPosition: Vector3,
    concreteName : string,
    name = "Chaser",
    movingEntity: MovingEntity = new MovingEntity(),
    lifePoints: number = 12,
    movementSpeed: number = 15,
    private _hasArmor: boolean = false,
  ) {
    super(name, concreteName, meshes, spawnPosition, movingEntity, lifePoints, movementSpeed, SHOOTING_DELAY);
  }

  public get hasArmor(): boolean {
    return this._hasArmor;
  }
}
