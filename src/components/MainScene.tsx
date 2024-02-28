import {
  Scene,
  Engine,
  Vector3,
  HemisphericLight,
  SceneLoader,
  ArcRotateCamera,
  AbstractMesh,
  Color4,
  ActionManager,
  ExecuteCodeAction,
} from "@babylonjs/core";

import "@babylonjs/loaders/glTF";
import { IKeys } from "../interfaces/keys.interface";

export class MainScene {
  scene: Scene;
  engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.scene = this.CreateNewScene();
    this.scene.actionManager = new ActionManager(this.scene);

    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 6,
      200,
      new Vector3(0, 0, 0),
      this.scene,
    );

    this.CreateEnvironment().then(() => {
      this.CreateShip().then((ship) => {
        this.AssignCamera(camera, ship);
      });
    });

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateNewScene(): Scene {
    const scene = new Scene(this.engine);
    scene.clearColor = new Color4(0.26, 0.25, 0.23, 1);
    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 5, 0),
      this.scene,
    );

    hemiLight.intensity = 0.5;

    return scene;
  }

  async CreatePlayerMovement(playerMesh: AbstractMesh): Promise<void> {
    let keyStatus: IKeys = {
      w: false,
      a: false,
      s: false,
      d: false,
    };

    //Adding keydown event
    this.scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
        let key = evt.sourceEvent.key.toLowerCase();
        if (key in keyStatus) {
          keyStatus[key] = true;
        }
      }),
    );

    //Adding keyup event
    this.scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
        let key = evt.sourceEvent.key.toLowerCase();
        if (key in keyStatus) {
          keyStatus[key] = false;
        }
      }),
    );

    this.scene.onBeforeRenderObservable.add(() => {
      if (keyStatus.w || keyStatus.d || keyStatus.a || keyStatus.s) {
        playerMesh.moveWithCollisions(
          new Vector3(
            (keyStatus.d ? 1 : 0) - (keyStatus.a ? 1 : 0),
            0,
            (keyStatus.w ? 1 : 0) - (keyStatus.s ? 1 : 0),
          ),
        );
      }
    });

    this.scene.onPointerMove = (evt, pickInfo) => {
    
      if (pickInfo.pickedPoint) {
        playerMesh.lookAt(pickInfo.pickedPoint);
        playerMesh.rotation.x = 0;
        playerMesh.rotation.z = 0;
      }
    }
  }

  async CreateShip(): Promise<AbstractMesh> {

    //Creating ship mesh
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "src/assets/models/",
      "ship01.glb",
      this.scene,
    );

    const shipMesh = meshes[0];
    shipMesh.rotate(Vector3.Up(), Math.PI);

    await this.CreatePlayerMovement(shipMesh);

    shipMesh.position.y = 1;

    return shipMesh;
  }

  async CreateEnvironment() {
    const level = await SceneLoader.ImportMeshAsync(
      "",
      "src/assets/levels/",
      "testLevel.glb",
      this.scene,
    );
    level.meshes[1].enablePointerMoveEvents = true;
  }

  async AssignCamera(camera: ArcRotateCamera, target: AbstractMesh) {
    camera.setTarget(target);
  }
}
