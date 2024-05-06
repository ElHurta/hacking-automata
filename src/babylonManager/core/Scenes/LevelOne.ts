import "@babylonjs/core/Physics/physicsEngineComponent";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Debug/debugLayer";

import SceneWrapper from "./SceneWrapper";
import { Engine } from "@babylonjs/core";

export class LevelOne extends SceneWrapper {
  constructor(engine: Engine) {
    super(engine);
  }

}
