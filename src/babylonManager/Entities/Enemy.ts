import { AbstractMesh, Vector3 } from '@babylonjs/core';
import * as YUKA from "yuka";

export default class Enemy {
  private _MOVEMENT_SPEED = 25;
  private _mesh!: AbstractMesh;
  private _movingEntity = new YUKA.MovingEntity();
  private _lifePoints = 30;
  private _spawnPosition = new Vector3(50, 15, 0);

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

  public get MOVEMENT_SPEED(): number {
    return this._MOVEMENT_SPEED;
  }

  public get lifePoints(): number {
    return this._lifePoints;
  }

  public get spawnPosition(): Vector3 {
    return this._spawnPosition;
  }
}
