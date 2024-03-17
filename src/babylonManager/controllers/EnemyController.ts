import { Scene, Vector3, AbstractMesh, SceneLoader } from "@babylonjs/core";
import * as YUKA from "yuka";
import PlayerController from "./PlayerController";
import { syncPosition } from "../../utils/setRenderer";
import Enemy from "../entities/enemies/Enemy";
import CollisionDetector from "../core/CollisionDetector";

export default class EnemyController {
  private enemy: Enemy = new Enemy("Chaser", [], new Vector3(0, 15, 50));
  private enemiesList: Enemy[] = [];

  constructor(
    private scene: Scene,
    private playerController: PlayerController,
    private collisionDetector: CollisionDetector,
  ) {
    this.loadEnemyMesh().then((enemyMeshes) => {
      this.enemy.meshes = enemyMeshes;
      this.setupEnemyMovement(playerController.playerMovingEntity);
      this.collisionDetector.addSceneEntityToList(this.enemy);
    });
  }

  setupEnemyMovement(playerMovingEntity: YUKA.MovingEntity): void {
    const entityManager = new YUKA.EntityManager();
    const enemyVehicle = new YUKA.Vehicle();
    entityManager.add(enemyVehicle);

    enemyVehicle.position.set(
      this.enemy.spawnPosition.x,
      this.enemy.spawnPosition.y,
      this.enemy.spawnPosition.z,
    );

    enemyVehicle.setRenderComponent(this.enemy.meshes[0], syncPosition);
    enemyVehicle.maxSpeed = this.enemy.movementSpeed;

    const seekBehavior = new YUKA.SeekBehavior(playerMovingEntity.position);
    enemyVehicle.steering.add(seekBehavior);

    const time = new YUKA.Time();

    this.scene.onBeforeRenderObservable.add(() => {
      const delta = time.update().getDelta();
      entityManager.update(delta);
    });
  }

  async loadEnemyMesh(): Promise<AbstractMesh[]> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      null,
      import.meta.env.VITE_MODELS_PATH,
      import.meta.env.VITE_CHASER_ENEMY_MODEL,
      this.scene,
    );

    const enemyRootMesh = meshes[0];
    enemyRootMesh.position.y = this.enemy.spawnPosition.y;
    enemyRootMesh.position.x = this.enemy.spawnPosition.x;
    enemyRootMesh.ellipsoid = new Vector3(4, 1, 4);

    return meshes;
  }
}
