import { Scene } from "@babylonjs/core";
import Projectile from "../entities/Projectile";
import SceneEntity from "../entities/SceneEntity";

export default class CollisionDetector {
  private projectilesList: Projectile[] = [];
  private sceneEntities: SceneEntity[] = [];

  constructor(private scene: Scene) {
    this.scene.onAfterRenderObservable.add(() => {
      if (this.projectilesList.length > 0) this.checkCollisions();
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

  public addSceneEntityToList(entity: SceneEntity): void {
    this.sceneEntities.push(entity);
  }

  public get SceneEntities(): SceneEntity[] {
    return this.sceneEntities;
  }

  private checkCollisions(): void {
    const projectiles = [...this.projectilesList];
    projectiles.forEach((projectile) => {
      this.sceneEntities.forEach((entity) => {
        // Player Collision
        if (entity.name === "Player" && !projectile.isPlayerProjectile) {
          if (projectile.mesh.intersectsMesh(entity.meshes[4], true)) {
            entity.lifePoints -= 1;
            this.removeProjectileFromList(projectile);
          }
        }

        // Enemy Collision
        if (entity.name === "Chaser" && projectile.isPlayerProjectile) {
          if (projectile.mesh.intersectsMesh(entity.meshes[1], true)) {
            entity.lifePoints -= 1;
            this.removeProjectileFromList(projectile);
            console.log(entity.lifePoints);
          }
        }
      });
    });
  }
}
