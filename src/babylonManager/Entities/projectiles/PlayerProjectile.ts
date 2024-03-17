import { Vector3 } from "@babylonjs/core";
import Projectile from "./Projectile";

const MESH_NAME = "bullet01.glb";
const SHOOTING_DELAY = 150;
const TRAVEL_SPEED = 3;
const DAMAGE = 1;
const IS_DESTRUCTIBLE = false;
const IS_PLAYER_PROJECTILE = true;

export default class PlayerProjectile extends Projectile {
  constructor(projectileDirection: Vector3) {
    super(
      MESH_NAME,
      SHOOTING_DELAY,
      TRAVEL_SPEED,
      projectileDirection,
      DAMAGE,
      IS_DESTRUCTIBLE,
      IS_PLAYER_PROJECTILE,
    );
  }
}
