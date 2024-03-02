import { MainScene } from "./MainScene";

export class AppManager {
  private _mainScene: MainScene;

  constructor(private canvas: HTMLCanvasElement) {
    this._mainScene = new MainScene(canvas);
  }
}
