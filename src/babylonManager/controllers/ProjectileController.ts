import { AbstractMesh, Scene, SceneLoader } from "@babylonjs/core";
import Projectile from "../entities/projectiles/Projectile";
import CollisionDetector from "../core/CollisionDetector";

export default class ProjectileController {
  constructor(
    private scene: Scene,
    private collisionDetector: CollisionDetector,
    private lastShot: number = 0,
  ) {}

  shootProjectile(shooter: AbstractMesh, projectile: Projectile) {
    if (Date.now() - this.lastShot > projectile.shootingDelay) {
      this.lastShot = Date.now();
      this.createProjectile(shooter, projectile).then(() => {
        this.scene.registerBeforeRender(projectile.movementFunc);

        // Destroy bullet after 3 seconds
        setTimeout(() => {
          this.collisionDetector.disposeProjectile(projectile);
          this.collisionDetector.removeProjectileFromList(projectile);
        }, projectile.disposeTime);
      });
    }
  }

  async createProjectile(
    shooter: AbstractMesh,
    projectile: Projectile,
  ): Promise<AbstractMesh> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      null,
      import.meta.env.VITE_MODELS_PATH,
      projectile.meshName,
      this.scene,
    );

    const projectileModel = meshes[0];
    const shooterPosition = shooter.position.clone();

    // Set Bullet spawn position at the tip of the ship
    projectileModel.position = shooterPosition.add(shooter.forward.scale(4));
    projectileModel.rotation = shooter.rotation.clone();

    this.collisionDetector.addProjectileToList(projectile);
    projectile.mesh = projectileModel;

    return projectileModel;
  }
}
