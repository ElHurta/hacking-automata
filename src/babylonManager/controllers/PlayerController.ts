import {
  AbstractMesh,
  ActionManager,
  ArcRotateCamera,
  ExecuteCodeAction,
  MeshBuilder,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import { IKeys } from "../../interfaces/keys.interface";

import ProjectileFactory from "../entities/projectiles/ProjectileFactory";
import Player from "../entities/Player";

import ProjectileController from "./ProjectileController";
import { MovingEntity } from "yuka";
import { projectileType } from "../../enums/projectileType.enum";
import CollisionDetector from "../core/CollisionDetector";

export default class PlayerController {
  private projectileFactory = new ProjectileFactory();
  private player: Player = new Player("Player", [], new Vector3(0, 15, 0));

  constructor(
    private scene: Scene,
    private collisionDetector: CollisionDetector,
    private projectileController: ProjectileController = new ProjectileController(
      scene,
      collisionDetector,
    ),
  ) {
    this.loadShipMesh().then((meshes) => {
      this.player.meshes = meshes;
      this.setupPlayerInputs();
      this.collisionDetector.addSceneEntityToList(this.player);
    });
  }

  async loadShipMesh(): Promise<AbstractMesh[]> {
    //Creating ship mesh
    const { meshes } = await SceneLoader.ImportMeshAsync(
      null,
      import.meta.env.VITE_MODELS_PATH,
      import.meta.env.VITE_DEFAULT_PLAYER_MODEL,
      this.scene,
    );

    const shipRootMesh = meshes[0];
    const boundingBox = meshes[4].getBoundingInfo().boundingBox;

    const playerBox = MeshBuilder.CreateBox(
      "playerBox",
      {
        width: boundingBox.extendSizeWorld.x * 2,
        height: boundingBox.extendSizeWorld.y * 2,
        depth: boundingBox.extendSizeWorld.z * 2,
      },
      this.scene,
    );

    shipRootMesh.parent = playerBox;
    shipRootMesh.rotate(Vector3.Up(), Math.PI);
    playerBox.position = this.player.spawnPosition;
    playerBox.rotationQuaternion = null;

    playerBox.isVisible = false;
    playerBox.isPickable = false;

    playerBox.ellipsoid = new Vector3(
      boundingBox.extendSizeWorld.x,
      1,
      boundingBox.extendSizeWorld.z,
    );

    return [playerBox, ...meshes];
  }

  setupPlayerInputs(): void {
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
        this.player.meshes[0].moveWithCollisions(
          new Vector3(
            (keyStatus.d ? this.player.movementSpeed : 0) -
              (keyStatus.a ? this.player.movementSpeed : 0),
            0,
            (keyStatus.w ? this.player.movementSpeed : 0) -
              (keyStatus.s ? this.player.movementSpeed : 0),
          ),
        );

        this.player.movingEntity.position.set(
          this.player.meshes[0].position.x,
          this.player.meshes[0].position.y,
          this.player.meshes[0].position.z,
        );
      }

      if (keyStatus.space) {
        if (Date.now() - this.player.lastShotTime > this.player.shootingDelay) {
          this.player.lastShotTime = Date.now();
          this.projectileController.shootProjectile(
            this.player.meshes[0],
            this.projectileFactory.createProjectile(
              projectileType.PLAYER,
              this.player.meshes[0].forward.clone(),
            ),
          );
        }
      }
    });

    this.scene.onPointerMove = (_, pickInfo) => {
      if (pickInfo.pickedPoint) {
        this.player.meshes[0].lookAt(pickInfo.pickedPoint);
      }
      this.player.meshes[0].rotation.x = 0;
      this.player.meshes[0].rotation.z = 0;
    };
  }

  async AssignCameraToPlayer(camera: ArcRotateCamera) {
    camera.setTarget(this.player.meshes[0], true);
  }

  public get playerMovingEntity(): MovingEntity {
    return this.player.movingEntity;
  }
}
