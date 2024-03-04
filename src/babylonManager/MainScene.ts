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
  Light,
  LightGizmo,
  GizmoManager,
  MeshBuilder,
  ShadowGenerator,
  GlowLayer,
  PhysicsViewer,
  PhysicsAggregate,
  PhysicsShapeType,
} from "@babylonjs/core";
import "@babylonjs/core/Physics/physicsEngineComponent";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Debug/debugLayer";
import { havokModule } from "../externals/havok";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import { Inspector } from "@babylonjs/inspector";

import { IKeys } from "../interfaces/keys.interface";
import BulletController from "./controllers/BulletController";

export class MainScene {
  scene!: Scene;
  engine: Engine;
  bulletController!: BulletController;
  shadowGenerator: ShadowGenerator | undefined;
  physicsViewer: PhysicsViewer;
  havokPlugin: HavokPlugin | undefined;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.physicsViewer = new PhysicsViewer();

    this.CreateNewScene().then((scene) => {
      this.scene = scene;
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
    });
  }

  async CreateNewScene(): Promise<Scene> {
    const scene = new Scene(this.engine);
    scene.clearColor = new Color4(0.26, 0.25, 0.23, 1);
    const gl = new GlowLayer("glow", scene);
    gl.intensity = 0.3;
    this.havokPlugin = new HavokPlugin(true, await havokModule);

    scene.enablePhysics(new Vector3(0, 0, 0), this.havokPlugin);

    this.bulletController = new BulletController(
      this.scene,
      this.physicsViewer,
    );
    // Inspector.Show(scene, {});

    return scene;
  }

  CreateLights(): void {
    // const dirLight = new DirectionalLight(
    //   "dirLight",
    //   new Vector3(0, -1, 0),
    //   this.scene,
    // );

    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene,
    );

    hemiLight.intensity = 0.6;
    //this.shadowGenerator = new ShadowGenerator(1024, hemiLight);
    //this.shadowGenerator.usePoissonSampling = true;
    //this.shadowGenerator.useBlurExponentialShadowMap = true;
    //this.CreateGizmos(hemiLight);
  }

  CreateGizmos(customLight: Light): void {
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
    const keyStatus: IKeys = {
      w: false,
      a: false,
      s: false,
      d: false,
      space: false,
    };

    //Adding keydown event
    this.scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
        const key = evt.sourceEvent.key.toLowerCase();

        if (key in keyStatus) {
          keyStatus[key] = true;
        }

        if (key === " ") {
          keyStatus.space = true;
        }
      }),
    );

    //Adding keyup event
    this.scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
        const key = evt.sourceEvent.key.toLowerCase();
        if (key in keyStatus) {
          keyStatus[key] = false;
        }
        if (key === " ") {
          keyStatus.space = false;
        }
      }),
    );

    this.scene.onBeforeRenderObservable.add(() => {
      if (keyStatus.w || keyStatus.d || keyStatus.a || keyStatus.s) {
        playerMesh.moveWithCollisions(
          new Vector3(
            (keyStatus.d ? 0.7 : 0) - (keyStatus.a ? 0.7 : 0),
            0,
            (keyStatus.w ? 0.7 : 0) - (keyStatus.s ? 0.7 : 0),
          ),
        );
      }

      if (keyStatus.space) {
        this.bulletController.ShootBullet(playerMesh);
      }
    });

    this.scene.onPointerMove = (_, pickInfo) => {
      if (pickInfo.pickedPoint) {
        playerMesh.lookAt(pickInfo.pickedPoint);
      }
      playerMesh.rotation.x = 0;
      playerMesh.rotation.z = 0;
    };
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

    shipMesh.position.y = 15;

    //Adding collisions to ship
    shipMesh.checkCollisions = true;
    shipMesh.ellipsoid = new Vector3(3, 1, 3);

    shipMesh.rotationQuaternion = null;

    this.CreatePlayerMovement(shipMesh);

    //Adding shadow to ship
    if (this.shadowGenerator) {
      this.shadowGenerator.addShadowCaster(meshes[1]);
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

    level.meshes[1].receiveShadows = true;

    level.meshes.forEach((element) => {
      if (element.name.includes("UndestructibleBlock")) {
        new PhysicsAggregate(
          element,
          PhysicsShapeType.BOX,
          {
            mass: 0,
            restitution: 0.9,
          },
          this.scene,
        );
        element.checkCollisions = true;
      }

      if (element.name.includes("Walls")) {
        element.checkCollisions = true;
        element.visibility = 0;
      }
    });

    const fakeGround = MeshBuilder.CreateGround(
      "fakeGround",
      { width: 1000, height: 1000 },
      this.scene,
    );

    fakeGround.position.y = 14;
    fakeGround.enablePointerMoveEvents = true;
    fakeGround.visibility = 0;
  }

  async AssignCamera(camera: ArcRotateCamera, target: AbstractMesh) {
    camera.setTarget(target);
  }
}
