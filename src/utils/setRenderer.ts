import { AbstractMesh, Quaternion, Vector3 } from "@babylonjs/core";

export function syncPositionDefault(
  entity: YUKA.GameEntity,
  mesh: AbstractMesh,
): void {
  mesh.rotationQuaternion = new Quaternion(
    0,
    entity.rotation.y,
    0,
    entity.rotation.w,
  );

  if (mesh.collider?.collidedMesh) {
    entity.position.set(mesh.position.x, 15, mesh.position.z);
  }

  mesh.moveWithCollisions(
    new Vector3(
      entity.position.x - mesh.position.x,
      0,
      entity.position.z - mesh.position.z,
    ),
  );
}

export function syncPositionSphere(
  entity: YUKA.GameEntity,
  mesh: AbstractMesh,
): void {
  if (mesh.collider?.collidedMesh) {
    entity.position.set(mesh.position.x, 15, mesh.position.z);
  }
  
  mesh.moveWithCollisions(
    new Vector3(
      entity.position.x - mesh.position.x,
      0,
      entity.position.z - mesh.position.z,
    ),
  );
}
