export interface GameData {
    scenes: SceneData[];
}

export interface SceneData {
    name:          string;
    meshLevelName: string;
    enemies:       EnemyData[];
    player:        Player;
}

export interface EnemyData {
    name:          string;
    spawnPosX: number;
    spawnPosY: number;
    spawnPosZ: number;
}

export interface Player {
    spawnPosX: number;
    spawnPosY: number;
    spawnPosZ: number;
}