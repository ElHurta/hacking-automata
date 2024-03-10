import {
  AbstractMesh,
  ActionManager,
  ArcRotateCamera,
  ExecuteCodeAction,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import { IKeys } from "../../interfaces/keys.interface";

import ProjectileFactory from "../entities/ProjectileFactory";
import Player from "../entities/Player";

import ProjectileController from "./ProjectileController";
import { MovingEntity } from "yuka";
import { projectileType } from "../../enums/projectileType.enum";

export default class PlayerController {
  private projectileFactory = new ProjectileFactory();
  private player: Player = new Player();

  constructor(
    private scene: Scene,
    private projectileController: ProjectileController = new ProjectileController(
      scene,
    ),
  ) {
    this.CreateMesh().then((mesh) => {
      this.player.mesh = mesh;
      this.AddPlayerMovement();
    });
  }

  async CreateMesh(): Promise<AbstractMesh> {
    //Creating ship mesh
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      import.meta.env.VITE_MODELS_PATH,
      import.meta.env.VITE_DEFAULT_PLAYER_MODEL,
      this.scene,
    );

    const shipMesh = meshes[0];

    shipMesh.position.y = 15;
    shipMesh.rotate(Vector3.Up(), Math.PI);
    shipMesh.rotationQuaternion = null;

    return shipMesh;
  }

  AddPlayerMovement(): void {
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
        this.player.mesh.moveWithCollisions(
          new Vector3(
            (keyStatus.d ? this.player.MOVEMENT_SPEED : 0) -
              (keyStatus.a ? this.player.MOVEMENT_SPEED : 0),
            0,
            (keyStatus.w ? this.player.MOVEMENT_SPEED : 0) -
              (keyStatus.s ? this.player.MOVEMENT_SPEED : 0),
          ),
        );

        this.player.movingEntity.position.set(
          this.player.mesh.position.x,
          this.player.mesh.position.y,
          this.player.mesh.position.z,
        );
      }

      if (keyStatus.space) {
        this.projectileController.shootProjectile(
          this.player.mesh,
          this.projectileFactory.createProjectile(projectileType.PLAYER),
        );
      }
    });

    this.scene.onPointerMove = (_, pickInfo) => {
      if (pickInfo.pickedPoint) {
        this.player.mesh.lookAt(pickInfo.pickedPoint);
      }
      this.player.mesh.rotation.x = 0;
      this.player.mesh.rotation.z = 0;
    };
  }

  async AssignCameraToPlayer(camera: ArcRotateCamera) {
    camera.setTarget(this.player.mesh, true);
  }

  public get playerMovingEntity(): MovingEntity {
    return this.player.movingEntity;
  }
}
