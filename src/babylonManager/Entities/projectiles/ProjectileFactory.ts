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
      case projectileType.ENEMY:
        return new EnemyProjectile(projectileDirection);
      default:
        throw new Error("Invalid projectile type");
    }
  }
}
