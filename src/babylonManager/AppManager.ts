import { Engine } from "@babylonjs/core";
import { MainScene } from "./MainScene";

export class AppManager {
  private _mainScene: MainScene;
  private engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);
    this.engine.runRenderLoop(() => {
      this._mainScene.scene.render();
    });
    this._mainScene = new MainScene(this.engine);
  }
}
