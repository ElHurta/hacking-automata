import {
  Scene,
  Engine,
  Vector3,
  HemisphericLight,
  SceneLoader,
  ArcRotateCamera,
  Color4,
  ActionManager,
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
// import { Inspector } from "@babylonjs/inspector";

import PlayerController from "./controllers/PlayerController";
import EnemyController from "./controllers/EnemyController";
import CollisionDetector from "./core/CollisionDetector";

export class MainScene {
  scene!: Scene;
  engine: Engine;
  shadowGenerator: ShadowGenerator | undefined;
  physicsViewer: PhysicsViewer;
  havokPlugin: HavokPlugin | undefined;
  playerController!: PlayerController;
  enemyController: EnemyController | undefined;
  collisionDetector!: CollisionDetector;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true);
    this.physicsViewer = new PhysicsViewer();

    this.CreateNewScene().then((scene) => {
      this.scene = scene;
      this.collisionDetector = new CollisionDetector(this.scene);
      this.scene.actionManager = new ActionManager(this.scene);
      this.playerController = new PlayerController(
        this.scene,
        this.collisionDetector,
      );

      this.enemyController = new EnemyController(
        this.scene,
        this.playerController,
        this.collisionDetector,
      );

      const camera = new ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Math.PI / 6,
        200,
        new Vector3(0, 0, 0),
        this.scene,
      );

      this.CreateEnvironment().then(() => {
        this.playerController.AssignCameraToPlayer(camera);
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
          },
          this.scene,
        );
        element.checkCollisions = true;
      }

      if (element.name.includes("Walls")) {
        element.checkCollisions = true;
        element.visibility = 0;
      }

      this.collisionDetector.addSceneMeshToList(element);
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

  public get Scene(): Scene {
    return this.scene;
  }
}
