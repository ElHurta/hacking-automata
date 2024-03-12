import { AbstractMesh } from "@babylonjs/core";
import * as YUKA from "yuka";

export default class Enemy {
  private _mesh!: AbstractMesh;
  private _movingEntity = new YUKA.MovingEntity();

  constructor() {}

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
}
