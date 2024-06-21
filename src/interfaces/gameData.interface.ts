import { projectileType } from "../enums/projectileType.enum";
import { shootingPatterns } from "../enums/shootingPatterns.enum";

export interface GameData {
  scenes: SceneData[];
}

export interface SceneData {
  name: string;
  meshLevelName: string;
  enemies: EnemyData[];
  player: Player;
}

export interface EnemyData {
  name: string;
  concreteName: string;
  projectileType: projectileType;
  shootingPattern: shootingPatterns;
  spawnPosX: number;
  spawnPosY: number;
  spawnPosZ: number;
}

export interface Player {
  spawnPosX: number;
  spawnPosY: number;
  spawnPosZ: number;
}
