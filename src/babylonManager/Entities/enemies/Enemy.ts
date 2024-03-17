import { AbstractMesh, Vector3 } from "@babylonjs/core";
import SceneEntity from "../SceneEntity";
import { MovingEntity } from "yuka";

export default class Enemy extends SceneEntity {
  constructor(
    name: string,
    meshes: AbstractMesh[],
    spawnPosition: Vector3,
    movingEntity: MovingEntity = new MovingEntity(),
    lifePoints: number = 30,
    movementSpeed: number = 30,
  ) {
    super(name, meshes, spawnPosition, movingEntity, lifePoints, movementSpeed);
  }
}
