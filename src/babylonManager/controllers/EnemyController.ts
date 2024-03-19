import {
  Scene,
  Vector3,
  AbstractMesh,
  SceneLoader,
  MeshBuilder,
} from "@babylonjs/core";
import * as YUKA from "yuka";
import PlayerController from "./PlayerController";
import { syncPosition } from "../../utils/setRenderer";
import Enemy from "../entities/enemies/Enemy";
import CollisionDetector from "../core/CollisionDetector";
import ProjectileController from "./ProjectileController";
import ProjectileFactory from "../entities/projectiles/ProjectileFactory";
import { projectileType } from "../../enums/projectileType.enum";

export default class EnemyController {
  private projectileFactory = new ProjectileFactory();
  private enemy: Enemy = new Enemy("Chaser", [], new Vector3(0, 15, 50));

  constructor(
    private scene: Scene,
    private playerController: PlayerController,
    private collisionDetector: CollisionDetector,
    private projectileController: ProjectileController = new ProjectileController(
      scene,
      collisionDetector,
    ),
  ) {
    this.loadEnemyMesh().then((enemyMeshes) => {
      this.enemy.meshes = enemyMeshes;
      this.setupEnemyMovement(playerController.playerMovingEntity);
      this.setupEnemyShooting();
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

    const enemyUpdate = () => {
      const delta = time.update().getDelta();
      entityManager.update(delta);
      enemyLifeCheck();
    };

    const enemyLifeCheck = () => {
      if (this.enemy.lifePoints <= 0) {
        this.scene.unregisterBeforeRender(
          this.enemy.shootingFunction as () => void,
        );
        this.enemy.meshes.forEach((mesh) => {
          mesh.dispose();
        });
        this.scene.onBeforeRenderObservable.removeCallback(enemyUpdate);

        return;
      }
    };

    this.scene.onBeforeRenderObservable.add(enemyUpdate);
  }

  async loadEnemyMesh(): Promise<AbstractMesh[]> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      null,
      import.meta.env.VITE_MODELS_PATH,
      import.meta.env.VITE_CHASER_ENEMY_MODEL,
      this.scene,
    );

    const enemyRootMesh = meshes[0];

    const boundingBox = meshes[1].getBoundingInfo().boundingBox;

    const enemyBox = MeshBuilder.CreateBox(
      "enemyBox",
      {
        width: boundingBox.extendSizeWorld.x * 2,
        height: boundingBox.extendSizeWorld.y * 2,
        depth: boundingBox.extendSizeWorld.z * 2,
      },
      this.scene,
    );

    enemyRootMesh.parent = enemyBox;
    enemyRootMesh.rotate(Vector3.Up(), Math.PI);
    enemyBox.position = this.enemy.spawnPosition;
    enemyBox.rotationQuaternion = null;

    enemyBox.isVisible = false;
    enemyBox.isPickable = false;

    return [enemyBox, ...meshes];
  }

  setupEnemyShooting(): void {
    const shootingFunc = () => {
      this.projectileController.shootProjectile(
        this.enemy.meshes[0],
        this.projectileFactory.createProjectile(
          projectileType.ENEMY,
          this.enemy.meshes[0].forward.clone(),
        ),
      );
    };

    this.enemy.shootingFunction = shootingFunc;

    this.scene.registerBeforeRender(this.enemy.shootingFunction as () => void);
  }
}
