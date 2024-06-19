import PlayerProjectile from "./PlayerProjectile";
import EnemyProjectile from "./EnemyProjectile";
import { projectileType } from "../../../enums/projectileType.enum";
import Projectile from "./Projectile";
import { Vector3 } from "@babylonjs/core";

export default class ProjectileFactory {
  createProjectile(
    projectileOption: projectileType,
    projectileDirection: Vector3,
  ): Projectile {
    switch (projectileOption) {
      case projectileType.PLAYER:
        return new PlayerProjectile(projectileDirection);
      case projectileType.ENEMY_DESTRUCTIBLE:
        return new EnemyProjectile(projectileDirection, "desBullet01.glb", true);
      case projectileType.ENEMY_INDESTRUCTIBLE:
        return new EnemyProjectile(projectileDirection, "noDesBullet01.glb", false);
      default:
        throw new Error("Invalid projectile type");
    }
  }
}
