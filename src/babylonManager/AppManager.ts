import { Engine } from "@babylonjs/core";
import { LevelOne } from "./core/Scenes/LevelOne";
import SceneWrapper from "./core/Scenes/SceneWrapper";

export class AppManager {
  private _mainScene: SceneWrapper;
  private engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this._mainScene = new LevelOne(this.engine);
    this.engine.runRenderLoop(() => {
      this._mainScene.scene.render();
    });
  }
}
