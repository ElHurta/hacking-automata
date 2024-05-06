import { enemyType } from "../../../enums/enemyType.enum";
import { Vector3 } from "@babylonjs/core";
import Enemy from "./Enemy";
import Chaser from "./Chaser";
import Tower from "./Tower";
import Sphere from "./Sphere";
import { EnemyData } from "../../../interfaces/gameData.interface";

export default class EnemyFactory {
  createEnemy(enemyOption: string, spawnPosition: Vector3): Enemy {
    switch (enemyOption) {
      case enemyType.CHASER:
        return new Chaser([], spawnPosition);
      case enemyType.SPHERE:
        return new Sphere([], spawnPosition);
      case enemyType.TOWER:
        return new Tower([], spawnPosition);
      default:
        throw new Error("Invalid enemy type");
    }
  }

  createEnemiesByList(enemies: EnemyData[]): Enemy[] {
    return enemies.map((enemy) =>
      this.createEnemy(
        enemy.name,
        new Vector3(enemy.spawnPosX, enemy.spawnPosY, enemy.spawnPosZ),
      ),
    );
  }
}
