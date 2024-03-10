import Projectile from "./Projectile";

const MESH_NAME = "bullet01.glb";
const SHOOTING_DELAY = 150;
const TRAVEL_SPEED = 800;
const DAMAGE = 1;
const IS_DESTRUCTIBLE = true;
const DISPOSE_TIME = 3000;

export default class PlayerProjectile extends Projectile {
  constructor() {
    super(MESH_NAME, SHOOTING_DELAY, TRAVEL_SPEED, DAMAGE, IS_DESTRUCTIBLE, DISPOSE_TIME);
  }
}
