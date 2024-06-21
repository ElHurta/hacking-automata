import { enemyType } from "../../../enums/enemyType.enum";
import { Vector3 } from "@babylonjs/core";
import Enemy from "./Enemy";
import Chaser from "./Chaser";
import Tower from "./Tower";
import Sphere from "./Sphere";
import { EnemyData } from "../../../interfaces/gameData.interface";
import { shootingPatterns } from "../../../enums/shootingPatterns.enum";
import { projectileType } from "../../../enums/projectileType.enum";

export default class EnemyFactory {
  createEnemy(
    enemyOption: string,
    concreteName: string,
    spawnPosition: Vector3,
    shootingPattern: shootingPatterns = shootingPatterns.SINGLE,
    enemyProjectileType: projectileType = projectileType.ENEMY_DESTRUCTIBLE,
  ): Enemy {
    switch (enemyOption) {
      case enemyType.CHASER:
        return new Chaser([], spawnPosition, concreteName, shootingPattern, enemyProjectileType);
      case enemyType.SPHERE:
        return new Sphere([], spawnPosition, concreteName, shootingPattern, enemyProjectileType);
      case enemyType.TOWER:
        return new Tower([], spawnPosition, concreteName, shootingPattern, enemyProjectileType);
      default:
        throw new Error("Invalid enemy type");
    }
  }

  createEnemiesByList(enemies: EnemyData[]): Enemy[] {
    return enemies.map((enemy) =>
      this.createEnemy(
        enemy.name,
        enemy.concreteName,
        new Vector3(enemy.spawnPosX, enemy.spawnPosY, enemy.spawnPosZ),
        enemy.shootingPattern,
        enemy.projectileType,
      ),
    );
  }
}
