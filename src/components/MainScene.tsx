import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  SceneLoader,
  ArcRotateCamera,
  AbstractMesh,
} from "@babylonjs/core";

import "@babylonjs/loaders/glTF";

export class MainScene {
  scene: Scene;
  engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.scene = this.CreateNewScene();

    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 6,
      200,
      new Vector3(0, 0, 0),
      this.scene
    );

    this.CreateEnvironment();
    this.CreateShip().then((ship) => this.AssignCamera(camera, ship));

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateNewScene(): Scene {
    const scene = new Scene(this.engine);

    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 5, 0),
      this.scene,
    );

    hemiLight.intensity = 0.5;

    return scene;
  }

  async CreateShip() : Promise<AbstractMesh> {

    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "src/assets/models/",
      "ship01.glb",
      this.scene
    );

    const shipMesh = meshes[0];

    shipMesh.position.y = 1;
    shipMesh.rotate(Vector3.Up(), Math.PI);

    return shipMesh;
  }

  async CreateEnvironment() {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "src/assets/levels/",
      "testLevel.glb",
      this.scene
    );
  }

  async AssignCamera(camera : ArcRotateCamera , target: AbstractMesh) {
    camera.setTarget(target);
  }
}
