import { Vector3 } from "@babylonjs/core";
import Projectile from "./Projectile";

const MESH_NAME = "desBullet01.glb";
const TRAVEL_SPEED = 0.8;
const DAMAGE = 1;
const IS_DESTRUCTIBLE = true;
const IS_PLAYER_PROJECTILE = false;

export default class EnemyProjectile extends Projectile {
  constructor(projectileDirection: Vector3) {
    super(
      MESH_NAME,
      TRAVEL_SPEED,
      projectileDirection,
      DAMAGE,
      IS_DESTRUCTIBLE,
      IS_PLAYER_PROJECTILE,
    );
  }
}
