import { Engine } from "@babylonjs/core";
import SceneWrapper from "./core/Scenes/SceneWrapper";
import { fetchGameData } from "./core/LevelDataReader";
import { GameData } from "../interfaces/gameData.interface";
import LevelFactory from "./core/LevelFactory";

enum GAME_STATE {
  START,
  LOADING,
  MAIN_MENU,
  GAME,
  LEVEL_COMPLETE,
  GAME_OVER,
}
export class AppManager {
  private _currentLevel: SceneWrapper | undefined;
  private _gameData: GameData | undefined;
  private _gameState: GAME_STATE = GAME_STATE.START;
  private engine: Engine;
  private levelFactory;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.levelFactory = new LevelFactory(this.engine);
    this.setGameData().then(() => {
      if (this._gameData) {
        this._currentLevel = this.levelFactory.createScene(
          this._gameData.scenes[0],
        );
        this.engine.runRenderLoop(() => {
          switch (this._gameState) {
            case GAME_STATE.START:
              console.log("Game State: Start");
              this._gameState = GAME_STATE.LOADING;
              break;
            case GAME_STATE.LOADING:
              console.log("Game State: Loading");
              this._gameState = GAME_STATE.MAIN_MENU;
              break;
            case GAME_STATE.MAIN_MENU:
              console.log("Game State: Main Menu");
              this._gameState = GAME_STATE.GAME;
              break;
            case GAME_STATE.GAME:
              this._currentLevel?.scene.render();
              console.log("Game State: Game");
              break;
            case GAME_STATE.LEVEL_COMPLETE:
              console.log("Game State: Level Complete");
              break;
            case GAME_STATE.GAME_OVER:
              console.log("Game State: Game Over");
              break;
          }
        });
      }
    });
  }

  async setGameData() {
    try {
      this._gameData = await fetchGameData();
      console.log("Game Data:", this._gameData);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}
