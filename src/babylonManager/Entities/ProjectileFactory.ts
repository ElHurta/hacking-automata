import PlayerProjectile from "./PlayerProjectile";
import EnemyProjectile from "./EnemyProjectile";
import { projectileType } from "../../enums/projectileType.enum";
import Projectile from "./Projectile";

export default class ProjectileFactory {
  createProjectile(projectileOption: projectileType): Projectile {
    switch (projectileOption) {
      case projectileType.PLAYER:
        return new PlayerProjectile();
      case projectileType.ENEMY:
        return new EnemyProjectile();
      default:
        throw new Error("Invalid projectile type");
    }
  }
}
