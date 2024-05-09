import { AbstractMesh, MeshBuilder, Scene, SceneLoader } from "@babylonjs/core";
import Projectile from "../entities/projectiles/Projectile";
import CollisionDetector from "../core/CollisionDetector";

export default class ProjectileController {
  constructor(
    private scene: Scene,
    private collisionDetector: CollisionDetector,
  ) {}

  shootProjectile(shooter: AbstractMesh, projectile: Projectile) {
    this.createProjectile(shooter, projectile).then(() => {
      this.scene.registerBeforeRender(projectile.movementFunc);

      // Destroy bullet after 3 seconds
      setTimeout(() => {
        this.collisionDetector.disposeProjectile(projectile);
        this.collisionDetector.removeProjectileFromList(projectile);
      }, projectile.disposeTime);
    });
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

    const projectileRootMesh = meshes[0];
    const boundingBox = meshes[1].getBoundingInfo().boundingBox;

    const projectileBox = MeshBuilder.CreateBox(
      "projectileBox",
      {
        width: boundingBox.extendSizeWorld.x * 2,
        height: boundingBox.extendSizeWorld.y * 2,
        depth: boundingBox.extendSizeWorld.z * 2,
      },
      this.scene,
    );

    projectileRootMesh.parent = projectileBox;
    const shooterPosition = shooter.position.clone();

    projectileBox.isVisible = false;
    projectileBox.isPickable = false;

    // Set Bullet spawn position at the tip of the ship
    projectileBox.position = shooterPosition.add(shooter.forward.scale(4));
    projectileBox.rotation = shooter.rotation.clone();

    projectile.mesh = projectileBox;
    this.collisionDetector.addProjectileToList(projectile);

    return projectileBox;
  }
}
