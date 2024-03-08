import { AbstractMesh, Quaternion, Vector3 } from "@babylonjs/core";

export function syncPosition(
  entity: YUKA.GameEntity,
  mesh: AbstractMesh,
): void {
  mesh.moveWithCollisions(
    new Vector3(
      entity.position.x - mesh.position.x,
      0,
      entity.position.z - mesh.position.z,
    ),
  );

  mesh.rotationQuaternion = new Quaternion(
    0,
    entity.rotation.y,
    0,
    entity.rotation.w,
  );
}
