import {
  Scene,
  Vector3,
  AbstractMesh,
  SceneLoader,
  MeshBuilder,
} from "@babylonjs/core";
import * as YUKA from "yuka";
import PlayerController from "./PlayerController";
import {
  syncPositionDefault,
  syncPositionSphere,
} from "../../utils/setRenderer";
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
    private entityManager = new YUKA.EntityManager(),
  ) {
    this.createEnemies()
      .then(() => {
        console.log("Enemies created", this.enemies);
        this.createUpdateFunction();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  setupEnemyMovement(
    enemyObject: Enemy,
    playerMovingEntity: YUKA.MovingEntity,
  ): void {
    const enemyVehicle = new YUKA.Vehicle();

    enemyVehicle.position.set(
      enemyObject.spawnPosition.x,
      enemyObject.spawnPosition.y,
      enemyObject.spawnPosition.z,
    );

    enemyVehicle.maxSpeed = enemyObject.movementSpeed;

    const leftToRightPath = new YUKA.Path();

    leftToRightPath.add(
      new YUKA.Vector3(
        enemyObject.spawnPosition.x - 10,
        enemyObject.spawnPosition.y,
        enemyObject.spawnPosition.z,
      ),
    );

    leftToRightPath.add(
      new YUKA.Vector3(
        enemyObject.spawnPosition.x + 10,
        enemyObject.spawnPosition.y,
        enemyObject.spawnPosition.z,
      ),
    );

    leftToRightPath.loop = true;

    // Set chaser behavior:
    if (enemyObject.name === "Chaser") {
      enemyVehicle.setRenderComponent(
        enemyObject.meshes[0],
        syncPositionDefault,
      );

      const pathBehavior = new YUKA.SeekBehavior(playerMovingEntity.position);
      enemyVehicle.steering.add(pathBehavior);
    }

    if (enemyObject.name === "Sphere") {
      enemyVehicle.setRenderComponent(
        enemyObject.meshes[0],
        syncPositionSphere,
      );

      enemyVehicle.position.copy(leftToRightPath.current());

      const pathBehavior = new YUKA.FollowPathBehavior(leftToRightPath, 0.5);
      enemyVehicle.steering.add(pathBehavior);
    }

    this.entityManager.add(enemyVehicle);
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
    enemyBox.position.copyFrom(enemyObject.spawnPosition);
    enemyBox.rotationQuaternion = null;

    enemyBox.isVisible = false;
    enemyBox.isPickable = false;
    enemyBox.checkCollisions = true;
    enemyBox.lookAt(
      new Vector3(
        this.playerController.playerMovingEntity.position.x,
        this.playerController.playerMovingEntity.position.y,
        this.playerController.playerMovingEntity.position.z,
      ),
    );

    return [enemyBox, ...meshes];
  }

  setupEnemyShooting(
    enemyObject: Enemy,
    enemyProjectileController: ProjectileController,
  ): void {
    setTimeout(() => {
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

      this.scene.registerBeforeRender(
        enemyObject.shootingFunction as () => void,
      );
    }, 500);
  }

  async createEnemies(): Promise<void> {
    this.enemies = this.enemyFactory.createEnemiesByList(this.enemiesData);

    for (const enemy of this.enemies) {
      const enemyMeshes = await this.loadEnemyMesh(enemy);

      enemy.meshes = enemyMeshes;

      this.setupEnemyMovement(enemy, this.playerController.playerMovingEntity);

      this.setupEnemyShooting(enemy, this.projectileController);

      this.collisionDetector.addSceneEntityToList(enemy);
    }
  }

  createUpdateFunction(): void {
    const time = new YUKA.Time();
    const enemyUpdate = () => {
      if (this.enemies.length === 0) {
        this.enemiesEliminatedObservable.notify();
        this.scene.onBeforeRenderObservable.removeCallback(enemyUpdate);
        return;
      }

      const delta = time.update().getDelta();
      this.entityManager.update(delta);
      enemiesLifeCheck();

      // Additional logic for Sphere enemy:
      for (const enemyObject of this.enemies) {
        if (enemyObject.name === "Sphere") {
          enemyObject.meshes[0].lookAt(
            new Vector3(
              this.playerController.playerMovingEntity.position.x,
              this.playerController.playerMovingEntity.position.y,
              this.playerController.playerMovingEntity.position.z,
            ),
          );
        }
      }
    };

    const enemiesLifeCheck = () => {
      for (const enemyObject of this.enemies) {
        if (enemyObject.lifePoints <= 0) {
          this.scene.unregisterBeforeRender(
            enemyObject.shootingFunction as () => void,
          );
          enemyObject.meshes.forEach((mesh) => {
            mesh.dispose();
          });
          this.enemies = this.enemies.filter((enemy) => enemy !== enemyObject);
        }
      }
    };

    this.scene.onBeforeRenderObservable.add(enemyUpdate);
  }
}
