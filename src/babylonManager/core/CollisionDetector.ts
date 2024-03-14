import { AbstractMesh, Scene } from "@babylonjs/core";
import Projectile from "../entities/Projectile";
import SceneEntity from "../entities/SceneEntity";

export default class CollisionDetector {
  private projectilesList: Projectile[] = [];
  private sceneEntities: SceneEntity[] = [];
  private sceneMeshes: AbstractMesh[] = [];

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

  public addSceneMeshToList(mesh: AbstractMesh): void {
    this.sceneMeshes.push(mesh);
  }

  public get SceneEntities(): SceneEntity[] {
    return this.sceneEntities;
  }

  private handleProjectileCollisions(): void {
    const projectiles = [...this.projectilesList];
    projectiles.forEach((projectile) => {
      this.sceneEntities.forEach((entity) => {
        // Player Collision
        if (entity.name === "Player" && !projectile.isPlayerProjectile) {
          if (projectile.mesh.intersectsMesh(entity.meshes[4], true)) {
            entity.lifePoints -= 1;
            this.disposeProjectile(projectile);
          }
        }

        // Enemy Collision
        if (entity.name === "Chaser" && projectile.isPlayerProjectile) {
          if (projectile.mesh.intersectsMesh(entity.meshes[1], true)) {
            entity.lifePoints -= 1;
            this.disposeProjectile(projectile);
          }
        }
      });
    });
  }
}
