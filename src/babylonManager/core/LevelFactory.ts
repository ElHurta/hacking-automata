import { Engine } from "@babylonjs/core";
import { levelEnum } from "../../enums/level.enum";
import { SceneData } from "../../interfaces/gameData.interface";
import { LevelOne } from "./Scenes/LevelOne";
import { LevelTwo } from "./Scenes/LevelTwo";

export default class LevelFactory {
  constructor(private engine: Engine) {}

  createScene(
    sceneData: SceneData,
    goToCompleteLevel: () => void,
    goToGameOver: () => void,
  ) {
    switch (sceneData.name) {
      case levelEnum.LEVEL_1:
        return new LevelOne(
          this.engine,
          sceneData,
          goToCompleteLevel,
          goToGameOver,
        );
      case levelEnum.LEVEL_2:
        return new LevelTwo(
          this.engine,
          sceneData,
          goToCompleteLevel,
          goToGameOver,
        );
      //   case levelEnum.LEVEL_3:
      //     return new LevelThree();
      //   case levelEnum.LEVEL_4:
      //     return new LevelFour();
      //   case levelEnum.LEVEL_5:
      //     return new LevelFive();
      //   case levelEnum.LEVEL_6:
      //     return new LevelSix();
      //   case levelEnum.LEVEL_7:
      //     return new LevelSeven();
      //   case levelEnum.LEVEL_8:
      //     return new LevelEight();
      //   case levelEnum.LEVEL_9:
      //     return new LevelNine();
      //   case levelEnum.LEVEL_10:
      //     return new LevelTen();
      //   case levelEnum.GAME_OVER:
      //     return new GameOver();
      //   case levelEnum.WIN:
      //     return new Win();
      default:
        throw new Error("Invalid level type");
    }
  }
}
