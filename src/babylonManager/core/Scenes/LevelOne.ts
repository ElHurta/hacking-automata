import SceneWrapper from "./SceneWrapper";
import { Engine } from "@babylonjs/core";
import { SceneData } from "../../../interfaces/gameData.interface";

export class LevelOne extends SceneWrapper {
  constructor(
    engine: Engine,
    sceneData: SceneData,
    goToCompleteLevel: () => void,
    goToGameOver: () => void,
  ) {
    super(engine, sceneData, goToCompleteLevel, goToGameOver);
  }
}
