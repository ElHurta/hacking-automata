import { AbstractMesh, Vector3 } from "@babylonjs/core";
import SceneEntity from "./SceneEntity";

export default class Obstacle extends SceneEntity {
  constructor(
    name: string,
    meshes: AbstractMesh[],
    spawnPosition: Vector3,
  ) {
    super(name, '', meshes, spawnPosition);
  }
}
