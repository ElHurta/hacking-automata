import { AbstractMesh, Vector3 } from "@babylonjs/core";

import Enemy from "./Enemy";
import { MovingEntity } from "yuka";
import { projectileType } from "../../../enums/projectileType.enum";

const SHOOTING_DELAY = 600;

export default class Tower extends Enemy {
  constructor(
    meshes: AbstractMesh[],
    spawnPosition: Vector3,
    concreteName: string,
    shootingPattern: string = "singleProjectile",
    enemyProjectileType: projectileType = projectileType.NONE,
    name = "Tower",
    movingEntity: MovingEntity = new MovingEntity(),
    lifePoints: number = 45,
    movementSpeed: number = 0,
  ) {
    super(
      name,
      concreteName,
      meshes,
      spawnPosition,
      movingEntity,
      lifePoints,
      movementSpeed,
      shootingPattern,
      enemyProjectileType,
      SHOOTING_DELAY,
    );
  }
}
