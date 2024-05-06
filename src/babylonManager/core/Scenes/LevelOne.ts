import "@babylonjs/core/Physics/physicsEngineComponent";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Debug/debugLayer";

import SceneWrapper from "./SceneWrapper";
import { Engine } from "@babylonjs/core";
import { SceneData } from "../../../interfaces/gameData.interface";

export class LevelOne extends SceneWrapper {

  constructor(engine: Engine, private sceneData: SceneData) {
    super(engine, sceneData.meshLevelName);
  }
}
