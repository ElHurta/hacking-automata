export interface GameData {
    scenes: SceneData[];
}

export interface SceneData {
    name:          string;
    meshLevelName: string;
    enemies:       Enemy[];
    player:        Player;
}

export interface Enemy {
    name:          string;
    spawnPosition: string;
}

export interface Player {
    spawnPosition: string;
}
