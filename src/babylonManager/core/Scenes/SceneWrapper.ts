import {
  ActionManager,
  ArcRotateCamera,
  Color4,
  Engine,
  GizmoManager,
  GlowLayer,
  HemisphericLight,
  Light,
  LightGizmo,
  MeshBuilder,
  Scene,
  SceneLoader,
  ShadowGenerator,
  Vector3,
} from "@babylonjs/core";
import PlayerController from "../../controllers/PlayerController";
import EnemyController from "../../controllers/EnemyController";
import CollisionDetector from "../CollisionDetector";
import Obstacle from "../../entities/Obstacle";

export default class SceneWrapper {
  scene!: Scene;
  shadowGenerator: ShadowGenerator | undefined;
  playerController!: PlayerController;
  enemyController: EnemyController | undefined;
  collisionDetector!: CollisionDetector;

  constructor(
    private engine: Engine,
    private meshLevelName: string = "testLevel.glb",
  ) {
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

      this.CreateFakeGround();

      this.CreateLights();
    });
  }

  async CreateNewScene(): Promise<Scene> {
    const scene = new Scene(this.engine);
    scene.collisionsEnabled = true;
    scene.clearColor = new Color4(0.26, 0.25, 0.23, 1);
    const gl = new GlowLayer("glow", scene);
    gl.intensity = 0.4;
    // Inspector.Show(scene, {});

    return scene;
  }

  CreateLights(): void {
    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene,
    );

    hemiLight.intensity = 0.8;
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
      null,
      import.meta.env.VITE_LEVEL_MODELS_PATH,
      this.meshLevelName,
      this.scene,
    );

    level.meshes.forEach((element) => {
      if (element.name.includes("UndestructibleBlock")) {
        element.checkCollisions = true;
        this.collisionDetector.addSceneEntityToList(
          new Obstacle("Obstacle", [element], element.position),
        );
      }

      if (element.name.includes("Walls")) {
        element.checkCollisions = true;
        element.visibility = 0;
        this.collisionDetector.addSceneEntityToList(
          new Obstacle("Obstacle", [element], element.position),
        );
      }
    });
  }

  async CreateFakeGround() {
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
