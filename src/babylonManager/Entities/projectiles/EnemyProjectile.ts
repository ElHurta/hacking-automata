import { Vector3 } from "@babylonjs/core";
import Projectile from "./Projectile";

const MESH_NAME = "bullet02.glb";
const SHOOTING_DELAY = 150;
const TRAVEL_SPEED = 800;
const DAMAGE = 1;
const IS_DESTRUCTIBLE = true;
const DISPOSE_TIME = 3000;
const IS_PLAYER_PROJECTILE = false;

export default class EnemyProjectile extends Projectile {
  constructor(projectileDirection: Vector3) {
    super(
      MESH_NAME,
      SHOOTING_DELAY,
      TRAVEL_SPEED,
      projectileDirection,
      DAMAGE,
      IS_DESTRUCTIBLE,
      DISPOSE_TIME,
      IS_PLAYER_PROJECTILE,
    );
  }
}