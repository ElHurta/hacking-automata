import { Scene, Vector3, AbstractMesh, SceneLoader } from "@babylonjs/core";
import * as YUKA from "yuka";
import PlayerController from "./PlayerController";
import { syncPosition } from "../../utils/setRenderer";

export default class EnemyController {
  constructor(
    private scene: Scene,
    private playerController: PlayerController,
  ) {}

  CreateEnemyMovement(
    enemyMesh: AbstractMesh,
    player: YUKA.MovingEntity,
  ): void {
    const entityManager = new YUKA.EntityManager();
    const enemyVehicle = new YUKA.Vehicle();
    entityManager.add(enemyVehicle);

    enemyVehicle.position.set(
      enemyMesh.position.x,
      enemyMesh.position.y,
      enemyMesh.position.z,
    );

    enemyVehicle.setRenderComponent(enemyMesh, syncPosition);
    enemyVehicle.maxSpeed = 25;

    const seekBehavior = new YUKA.SeekBehavior(player.position);
    enemyVehicle.steering.add(seekBehavior);

    const time = new YUKA.Time();

    this.scene.onBeforeRenderObservable.add(() => {
      const delta = time.update().getDelta();
      entityManager.update(delta);
    });
  }

  async CreateEnemy(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "src/assets/models/",
      "basicEnemy01.glb",
      this.scene,
    );

    const enemyMesh = meshes[0];
    enemyMesh.position.y = 15;
    enemyMesh.position.x = 50;

    enemyMesh.checkCollisions = true;
    enemyMesh.ellipsoid = new Vector3(3, 1, 3);

    this.CreateEnemyMovement(
      enemyMesh,
      this.playerController.getMovingEntity(),
    );
  }
}
