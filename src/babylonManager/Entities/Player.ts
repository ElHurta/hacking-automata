import { AbstractMesh, Scene } from "@babylonjs/core";
import * as YUKA from "yuka";

export default class Player {
  private _MOVEMENT_SPEED = 0.5;
  private _mesh!: AbstractMesh;
  private _movingEntity = new YUKA.MovingEntity();

  constructor(private scene: Scene) {}

  public get mesh(): AbstractMesh {
    return this._mesh;
  }

  public set mesh(mesh: AbstractMesh) {
    this._mesh = mesh;
  }

  public get movingEntity(): YUKA.MovingEntity {
    return this._movingEntity;
  }

  public set movingEntity(entity: YUKA.MovingEntity) {
    this._movingEntity = entity;
  }

  public get MOVEMENT_SPEED(): number {
    return this._MOVEMENT_SPEED;
  }
}
