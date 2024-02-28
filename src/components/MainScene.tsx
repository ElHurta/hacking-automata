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
  DirectionalLight,
  Light,
  LightGizmo,
  GizmoManager,
  MeshBuilder,
  ShadowGenerator,
} from "@babylonjs/core";

import "@babylonjs/loaders/glTF";
import { IKeys } from "../interfaces/keys.interface";

export class MainScene {
  scene: Scene;
  engine: Engine;
  shadowGenerator: ShadowGenerator | undefined;

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

    this.CreateLights();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateNewScene(): Scene {
    const scene = new Scene(this.engine);
    scene.clearColor = new Color4(0.26, 0.25, 0.23, 1);
    
    return scene;
  }

  CreateLights(): void {
    const dirLight = new DirectionalLight(
      "dirLight",
      new Vector3(0, -1, 0),
      this.scene,
    );

    dirLight.intensity = 1;
    this.shadowGenerator = new ShadowGenerator(1024, dirLight);
    this.shadowGenerator.usePoissonSampling = true;
    // this.shadowGenerator.useBlurCloseExponentialShadowMap = true;
    // this.CreateGizmos(dirLight);
  }

  CreateGizmos(customLight: Light) : void {
    const lightGizmo = new LightGizmo();
    lightGizmo.light = customLight;
    lightGizmo.scaleRatio = 2;

    const gizmoManager = new GizmoManager(this.scene);
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.usePointerToAttachGizmos = false;
    gizmoManager.attachToMesh(lightGizmo.attachedMesh);
  }

  CreatePlayerMovement(playerMesh: AbstractMesh): void {
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

    this.scene.onPointerMove = (_, pickInfo) => {
      
      if (pickInfo.pickedPoint) {
        playerMesh.lookAt(pickInfo.pickedPoint);
      }
      playerMesh.rotation.x = 0;
      playerMesh.rotation.z = 0;
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
    shipMesh.rotationQuaternion = null;
    shipMesh.position.y = 3;

    this.CreatePlayerMovement(shipMesh);

    //Adding shadow to ship
    if (this.shadowGenerator) {
      this.shadowGenerator.addShadowCaster(shipMesh);
    }

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
    level.meshes[1].receiveShadows = true;

    const fakeGround = MeshBuilder.CreateGround(
      "fakeGround",
      { width: 1000, height: 1000 },
      this.scene,
    );

    fakeGround.position.y = -1;
    fakeGround.enablePointerMoveEvents = true;
    fakeGround.visibility = 0;
  }

  async AssignCamera(camera: ArcRotateCamera, target: AbstractMesh) {
    camera.setTarget(target);
  }
}
