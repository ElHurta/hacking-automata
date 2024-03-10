import {
  AbstractMesh,
  PhysicsAggregate,
  PhysicsEventType,
  PhysicsShapeType,
  Scene,
  SceneLoader,
} from "@babylonjs/core";
import Projectile from "../entities/Projectile";

export default class ProjectileController {
  constructor(
    private scene: Scene,
    private lastShot: number = 0,
  ) {}

  shootProjectile(shooter: AbstractMesh, projectile: Projectile) {
    if (Date.now() - this.lastShot > projectile.shootingDelay) {
      this.lastShot = Date.now();

      this.createProjectile(shooter, projectile).then((projectileMesh) => {
        projectileMesh.physicsBody?.setLinearVelocity(
          shooter.forward.scale(-projectile.speed),
        );

        const observable = projectileMesh
          .getPhysicsBody()
          ?.getCollisionObservable();
        if (observable) {
          observable.add((collisionEvent) => {
            if (collisionEvent.type === PhysicsEventType.COLLISION_STARTED) {
              projectileMesh.dispose();
            }
          });
        }

        // Destroy bullet after 3 seconds
        setTimeout(() => {
          projectileMesh.dispose();
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

    const bulletMesh = meshes[0];
    const playerPosition = shooter.position.clone();

    // Set Bullet spawn position at the tip of the ship
    bulletMesh.position = playerPosition.add(shooter.forward.scale(-3));
    bulletMesh.rotation = shooter.rotation.clone();

    const bullletAggregate = new PhysicsAggregate(
      bulletMesh,
      PhysicsShapeType.BOX,
      {
        mass: 1,
      },
      this.scene,
    );

    bullletAggregate.body.disablePreStep = false;
    bullletAggregate.body.setCollisionCallbackEnabled(true);

    return bulletMesh;
  }
}
