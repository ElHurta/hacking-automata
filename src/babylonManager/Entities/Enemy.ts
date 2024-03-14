import { AbstractMesh, Vector3 } from "@babylonjs/core";
import * as YUKA from "yuka";
import SceneEntity from "./SceneEntity";

export default class Enemy extends SceneEntity {
  constructor(
    name: string,
    meshes: AbstractMesh[],
    spawnPosition: Vector3,
    movingEntity: YUKA.MovingEntity = new YUKA.MovingEntity(),
    lifePoints: number = 30,
    movementSpeed: number = 30,
  ) {
    super(name, meshes, spawnPosition, movingEntity, lifePoints, movementSpeed);
  }
}
