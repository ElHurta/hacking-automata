import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Debug/debugLayer";

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
import { SceneData } from "../../../interfaces/gameData.interface";

const CAMERA_ALPHA = -Math.PI / 2;
const CAMERA_BETA = Math.PI / 6;
const CAMERA_RADIUS = 200;

export default class SceneWrapper {
  scene!: Scene;
  shadowGenerator: ShadowGenerator | undefined;
  playerController!: PlayerController;
  enemyController: EnemyController | undefined;
  collisionDetector!: CollisionDetector;

  constructor(
    private engine: Engine,
    private sceneData: SceneData,
    private goToLevelComplete: () => void,
    private goToGameOver: () => void,
  ) {
    this.CreateNewScene().then((scene) => {
      this.scene = scene;
      this.collisionDetector = new CollisionDetector(this.scene);
      this.collisionDetector.playerEliminatedObservable.subscribe(() => {
        this.goToGameOver();
      });

      this.scene.actionManager = new ActionManager(this.scene);
      this.playerController = new PlayerController(
        this.scene,
        this.collisionDetector,
      );

      this.enemyController = new EnemyController(
        this.scene,
        this.playerController,
        this.collisionDetector,
        this.sceneData.enemies,
      );

      this.enemyController.enemiesEliminatedObservable.subscribe(() => {
        this.goToLevelComplete();
      });

      const camera = new ArcRotateCamera(
        "camera",
        CAMERA_ALPHA,
        CAMERA_BETA,
        CAMERA_RADIUS,
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
      this.sceneData.meshLevelName,
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
