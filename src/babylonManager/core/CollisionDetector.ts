import { Scene } from "@babylonjs/core";
import Projectile from "../entities/projectiles/Projectile";
import SceneEntity from "../entities/SceneEntity";

export default class CollisionDetector {
  private projectilesList: Projectile[] = [];
  private sceneEntities: SceneEntity[] = [];

  constructor(private scene: Scene) {
    this.scene.onAfterRenderObservable.add(() => {
      if (this.projectilesList.length > 0) this.handleProjectileCollisions();
    });
  }

  public addProjectileToList(projectile: Projectile): void {
    this.projectilesList.push(projectile);
  }

  public get ProjectilesList(): Projectile[] {
    return this.projectilesList;
  }

  public removeProjectileFromList(projectile: Projectile): void {
    const index = this.projectilesList.indexOf(projectile);
    if (index > -1) {
      this.projectilesList.splice(index, 1);
    }
  }

  disposeProjectile(projectile: Projectile): void {
    this.scene.unregisterBeforeRender(projectile.movementFunc);
    this.removeProjectileFromList(projectile);
    projectile.mesh.dispose();
  }

  public addSceneEntityToList(entity: SceneEntity): void {
    this.sceneEntities.push(entity);
  }

  public get SceneEntities(): SceneEntity[] {
    return this.sceneEntities;
  }

  private handleProjectileCollisions(): void {
    const projectiles = [...this.projectilesList];
    projectiles.forEach((projectile) => {
      // Collision with meshes detecting collisions, usually scenery
      if (projectile.mesh.collider?.collidedMesh) {
        this.disposeProjectile(projectile);
      } else {
        // Collision with entities
        this.sceneEntities.forEach((entity) => {
          // Player Collision
          if (entity.name === "Player" && !projectile.isPlayerProjectile) {
            if (projectile.mesh.intersectsMesh(entity.meshes[0], true)) {
              entity.lifePoints -= 1;
              this.disposeProjectile(projectile);
            }
          }

          // Enemy Collision
          if (entity.name === "Chaser" && projectile.isPlayerProjectile) {
            if (projectile.mesh.intersectsMesh(entity.meshes[0], true)) {
              this.disposeProjectile(projectile);
              entity.lifePoints -= 1;
              if (entity.lifePoints <= 0) {
                this.sceneEntities = this.sceneEntities.filter(
                  (e) => e.name !== "Chaser",
                );
              }
            }
          }
        });
      }
    });
  }
}
