import { Scene, Vector3, AbstractMesh, SceneLoader } from "@babylonjs/core";
import * as YUKA from "yuka";
import PlayerController from "./PlayerController";
import { syncPosition } from "../../utils/setRenderer";
import Enemy from "../entities/Enemy";

export default class EnemyController {
  private enemy : Enemy = new Enemy();
  constructor(
    private scene: Scene,
    private playerController: PlayerController,
  ) {
    this.CreateEnemy().then((enemyMesh) => {
      this.enemy.mesh = enemyMesh;
      this.CreateEnemyMovement(playerController.playerMovingEntity);
    });
  }

  CreateEnemyMovement(
    playerMovingEntity: YUKA.MovingEntity,
  ): void {
    const entityManager = new YUKA.EntityManager();
    const enemyVehicle = new YUKA.Vehicle();
    entityManager.add(enemyVehicle);

    enemyVehicle.position.set(
      this.enemy.spawnPosition.x,
      this.enemy.spawnPosition.y,
      this.enemy.spawnPosition.z,
    );

    enemyVehicle.setRenderComponent(this.enemy.mesh, syncPosition);
    enemyVehicle.maxSpeed = this.enemy.MOVEMENT_SPEED;

    const seekBehavior = new YUKA.SeekBehavior(playerMovingEntity.position);
    enemyVehicle.steering.add(seekBehavior);

    const time = new YUKA.Time();

    this.scene.onBeforeRenderObservable.add(() => {
      const delta = time.update().getDelta();
      entityManager.update(delta);
    });
  }

  async CreateEnemy(): Promise<AbstractMesh> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      import.meta.env.VITE_MODELS_PATH,
      import.meta.env.VITE_CHASER_ENEMY_MODEL,
      this.scene,
    );

    const enemyMesh = meshes[0];
    enemyMesh.position.y = this.enemy.spawnPosition.y;
    enemyMesh.position.x = this.enemy.spawnPosition.x;

    enemyMesh.ellipsoid = new Vector3(3, 1, 3);

    return enemyMesh;
  }
}
