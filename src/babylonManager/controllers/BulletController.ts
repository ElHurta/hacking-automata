import {
  AbstractMesh,
  PhysicsAggregate,
  PhysicsShapeType,
  PhysicsViewer,
  Scene,
  SceneLoader,
} from "@babylonjs/core";

export default class BulletController {
  constructor(
    private scene: Scene,
    private physicsViewer: PhysicsViewer,
    private lastShot = 0,
    private shootDelay = 150,
  ) {}

  ShootBullet(playerMesh: AbstractMesh) {
    if (Date.now() - this.lastShot > this.shootDelay) {
      this.lastShot = Date.now();

      this.CreateBullet(playerMesh).then((bullet) => {
        bullet.physicsBody?.setLinearVelocity(playerMesh.forward.scale(-400));

        // Destroy bullet after 3 seconds
        setTimeout(() => {
          bullet.dispose();
        }, 3000);
      });
    }
  }

  async CreateBullet(playerMesh: AbstractMesh): Promise<AbstractMesh> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "src/assets/models/",
      "bullet01.glb",
      this.scene,
    );

    const bulletMesh = meshes[0];
    const playerPosition = playerMesh.position.clone();

    // Set Bullet spawn position at the tip of the ship
    bulletMesh.position = playerPosition.add(playerMesh.forward.scale(-3));
    bulletMesh.rotation = playerMesh.rotation.clone();

    const bullletAggregate = new PhysicsAggregate(
      bulletMesh,
      PhysicsShapeType.BOX,
      {
        mass: 1,
      },
      this.scene,
    );

    bullletAggregate.body.disablePreStep = false;

    this.physicsViewer.showBody(bullletAggregate.body);

    return bulletMesh;
  }
}
