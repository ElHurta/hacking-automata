import { Engine } from "@babylonjs/core";
import SceneWrapper from "./SceneWrapper";
import { SceneData } from "../../../interfaces/gameData.interface";

export class LevelTwo extends SceneWrapper {
  constructor(
    engine: Engine,
    sceneData: SceneData,
    goToCompleteLevel: () => void,
    goToGameOver: () => void,
  ) {
    super(engine, sceneData, goToCompleteLevel, goToGameOver);
  }
}
