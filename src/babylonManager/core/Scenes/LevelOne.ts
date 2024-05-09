import "@babylonjs/core/Physics/physicsEngineComponent";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Debug/debugLayer";

import SceneWrapper from "./SceneWrapper";
import { Engine } from "@babylonjs/core";
import { SceneData } from "../../../interfaces/gameData.interface";
import { GAME_STATE } from "../../../enums/gameState.enum";

export class LevelOne extends SceneWrapper {
  constructor(engine: Engine, sceneData: SceneData, gameState: GAME_STATE) {
    super(engine, sceneData, gameState);
  }
}
