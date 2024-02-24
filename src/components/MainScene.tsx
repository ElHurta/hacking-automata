import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  SceneLoader,
} from "@babylonjs/core";

import "@babylonjs/loaders/glTF";

export class MainScene {
  scene: Scene;
  engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.scene = this.CreateNewScene();
    this.CreateShip();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateNewScene(): Scene {
    const scene = new Scene(this.engine);
    const camera = new FreeCamera(
      "camera1",
      new Vector3(0, 5, -10),
      this.scene,
    );
    camera.attachControl();

    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene,
    );

    hemiLight.intensity = 0.7;

    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 6, height: 6 },
      this.scene,
    );

    // const ball = MeshBuilder.CreateSphere("ball", { diameter: 1 }, this.scene);
    // ball.position.y = 1;

    return scene;
  }

  CreateShip() : void {
    SceneLoader.ImportMesh(
        "",
        "src/assets/models/",
        "ship01.glb",
        this.scene,
        (meshes) => {
            console.log(meshes);
        }
    );
  }
}
