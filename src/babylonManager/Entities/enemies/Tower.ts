import { AbstractMesh, Vector3 } from "@babylonjs/core";
import Enemy from "./Enemy";
import { MovingEntity } from "yuka";

export default class Tower extends Enemy {
  constructor(
    meshes: AbstractMesh[],
    spawnPosition: Vector3,
    name = "Tower",
    movingEntity: MovingEntity = new MovingEntity(),
    lifePoints: number = 45,
    movementSpeed: number = 0,
  ) {
    super(name, meshes, spawnPosition, movingEntity, lifePoints, movementSpeed);
  }
}
