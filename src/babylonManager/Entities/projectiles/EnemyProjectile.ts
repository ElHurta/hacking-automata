import { Vector3 } from "@babylonjs/core";
import Projectile from "./Projectile";

const MESH_NAME = "desBullet01.glb";
const TRAVEL_SPEED = 0.8;
const DAMAGE = 1;
const IS_DESTRUCTIBLE = true;
const IS_PLAYER_PROJECTILE = false;

export default class EnemyProjectile extends Projectile {
  constructor(
    projectileDirection: Vector3,
    meshName: string = MESH_NAME,
    isDestructible: boolean = IS_DESTRUCTIBLE,
  ) {
    super(
      meshName,
      TRAVEL_SPEED,
      projectileDirection,
      DAMAGE,
      isDestructible,
      IS_PLAYER_PROJECTILE,
    );
  }
}
