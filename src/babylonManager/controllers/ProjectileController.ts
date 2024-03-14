import { AbstractMesh, Scene, SceneLoader } from "@babylonjs/core";
import Projectile from "../entities/Projectile";
import CollisionDetector from "../core/CollisionDetector";

// Note: Some values are negative to make the projectile go forward, for some reason BabylonJS has the opposite direction on all my models 🙂
export default class ProjectileController {
  constructor(
    private scene: Scene,
    private collisionDetector: CollisionDetector,
    private lastShot: number = 0,
  ) {}

  disposeProjectile(projectile: AbstractMesh, movementFunc: () => void): void {
    this.scene.unregisterBeforeRender(movementFunc);
    projectile.dispose();
  }

  shootProjectile(shooter: AbstractMesh, projectile: Projectile) {
    if (Date.now() - this.lastShot > projectile.shootingDelay) {
      this.lastShot = Date.now();
      this.createProjectile(shooter, projectile).then((projectileMesh) => {
        this.scene.registerBeforeRender(() => projectile.movementFunc());

        // Destroy bullet after 3 seconds
        setTimeout(() => {
          this.disposeProjectile(projectileMesh, () => projectile.movementFunc());
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
      "",
      import.meta.env.VITE_MODELS_PATH,
      projectile.meshName,
      this.scene,
    );

    const projectileModel = meshes[0];
    const playerPosition = shooter.position.clone();

    // Set Bullet spawn position at the tip of the ship
    projectileModel.position = playerPosition.add(shooter.forward.scale(-3));
    projectileModel.rotation = shooter.rotation.clone();

    this.collisionDetector.addProjectileToList(projectile);
    projectile.mesh = projectileModel;

    return projectileModel;
  }

  // createBoundingBox(mesh: AbstractMesh): void {
  //   //const boundingBox = meshes[1].getBoundingInfo().boundingBox;
  //   // const newRoot = MeshBuilder.CreateBox(
  //   //   "bbMesh1",
  //   //   {
  //   //     width: boundingBox.extendSizeWorld.x * 2,
  //   //     height: boundingBox.extendSizeWorld.y * 2,
  //   //     depth: boundingBox.extendSizeWorld.z * 2,
  //   //   },
  //   //   this.scene,
  //   // );

  //   // const mat = new StandardMaterial("mat");
  //   // mat.diffuseColor = Color3.Green();
  //   // mat.alpha = 0.7;
  //   // newRoot.material = mat;

  //   // newRoot.position = boundingBox.centerWorld;
  //   // newRoot.rotation = projectileModel.rotation.clone();
  // }
}
