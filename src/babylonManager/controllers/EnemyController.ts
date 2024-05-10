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
import CollisionDetector from "../core/CollisionDetector";
import ProjectileController from "./ProjectileController";
import ProjectileFactory from "../entities/projectiles/ProjectileFactory";
import { projectileType } from "../../enums/projectileType.enum";
import EnemyFactory from "../entities/enemies/EnemyFactory";
import Enemy from "../entities/enemies/Enemy";
import { EnemyData } from "../../interfaces/gameData.interface";
import Observable from "../../utils/Observable";

export default class EnemyController {
  private projectileFactory = new ProjectileFactory();
  private enemyFactory = new EnemyFactory();
  private enemies: Enemy[] = [];

  public enemiesEliminatedObservable = new Observable();

  constructor(
    private scene: Scene,
    private playerController: PlayerController,
    private collisionDetector: CollisionDetector,
    private enemiesData: EnemyData[],
    private projectileController: ProjectileController = new ProjectileController(
      scene,
      collisionDetector,
    ),
  ) {
    this.createEnemies();
  }

  setupEnemyMovement(
    enemyObject: Enemy,
    playerMovingEntity: YUKA.MovingEntity,
  ): void {
    const entityManager = new YUKA.EntityManager();
    const enemyVehicle = new YUKA.Vehicle();
    entityManager.add(enemyVehicle);

    enemyVehicle.position.set(
      enemyObject.spawnPosition.x,
      enemyObject.spawnPosition.y,
      enemyObject.spawnPosition.z,
    );

    enemyVehicle.setRenderComponent(enemyObject.meshes[0], syncPosition);
    enemyVehicle.maxSpeed = enemyObject.movementSpeed;

    const seekBehavior = new YUKA.SeekBehavior(playerMovingEntity.position);
    enemyVehicle.steering.add(seekBehavior);

    const time = new YUKA.Time();

    const enemyUpdate = () => {
      const delta = time.update().getDelta();
      entityManager.update(delta);
      enemyLifeCheck();
    };

    const enemyLifeCheck = () => {
      if (enemyObject.lifePoints <= 0) {
        this.scene.unregisterBeforeRender(
          enemyObject.shootingFunction as () => void,
        );
        enemyObject.meshes.forEach((mesh) => {
          mesh.dispose();
        });
        this.enemies = this.enemies.filter((enemy) => enemy !== enemyObject);
        this.scene.onBeforeRenderObservable.removeCallback(enemyUpdate);

        if (this.enemies.length === 0) {
          this.enemiesEliminatedObservable.notify();
        }

        return;
      }
    };

    this.scene.onBeforeRenderObservable.add(enemyUpdate);
  }

  async loadEnemyMesh(enemyObject: Enemy): Promise<AbstractMesh[]> {
    let meshName = "";
    if (enemyObject.name === "Chaser") {
      meshName = import.meta.env.VITE_CHASER_ENEMY_MODEL;
    } else if (enemyObject.name === "Sphere") {
      meshName = import.meta.env.VITE_SPHERE_ENEMY_MODEL;
    }

    const { meshes } = await SceneLoader.ImportMeshAsync(
      null,
      import.meta.env.VITE_MODELS_PATH,
      meshName,
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
    enemyBox.position = enemyObject.spawnPosition;
    enemyBox.rotationQuaternion = null;

    enemyBox.isVisible = false;
    enemyBox.isPickable = false;
    enemyBox.checkCollisions = true;

    enemyBox.ellipsoid = new Vector3(
      boundingBox.extendSizeWorld.x,
      1,
      boundingBox.extendSizeWorld.z,
    );

    return [enemyBox, ...meshes];
  }

  setupEnemyShooting(
    enemyObject: Enemy,
    enemyProjectileController: ProjectileController,
  ): void {
    const shootingFunc = () => {
      if (Date.now() - enemyObject.lastShotTime > enemyObject.shootingDelay) {
        enemyObject.lastShotTime = Date.now();
        enemyProjectileController.shootProjectile(
          enemyObject.meshes[0],
          this.projectileFactory.createProjectile(
            projectileType.ENEMY,
            enemyObject.meshes[0].forward.clone(),
          ),
        );
      }
    };

    enemyObject.shootingFunction = shootingFunc;

    this.scene.registerBeforeRender(enemyObject.shootingFunction as () => void);
  }

  createEnemies(): void {
    this.enemies = this.enemyFactory.createEnemiesByList(this.enemiesData);

    console.log("Enemies:", this.enemies);
    this.enemies.forEach((enemy) => {
      this.loadEnemyMesh(enemy).then((enemyMeshes) => {
        enemy.meshes = enemyMeshes;
        this.setupEnemyMovement(
          enemy,
          this.playerController.playerMovingEntity,
        );
        this.setupEnemyShooting(enemy, this.projectileController);
        this.collisionDetector.addSceneEntityToList(enemy);
      });
    });
  }
}
