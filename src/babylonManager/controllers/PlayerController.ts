import {
  AbstractMesh,
  ActionManager,
  ExecuteCodeAction,
  PhysicsViewer,
  Scene,
  ShadowGenerator,
  Vector3,
  SceneLoader,
} from "@babylonjs/core";
import { IKeys } from "../../interfaces/keys.interface";
import BulletController from "./BulletController";

export default class PlayerController {
  constructor(
    private scene: Scene,
    private physicsViewer: PhysicsViewer,
    private bulletController: BulletController,
    private shadowGenerator: ShadowGenerator | undefined,
  ) {}

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

    this.bulletController = new BulletController(
      this.scene,
      this.physicsViewer,
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
}
