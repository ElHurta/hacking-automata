import {
  AbstractMesh,
  Color3,
  MeshBuilder,
  Scene,
  StandardMaterial,
} from "@babylonjs/core";

export default function createBoundingBox(
  mesh: AbstractMesh,
  scene: Scene,
): void {
  const boundingBox = mesh.getBoundingInfo().boundingBox;
  const newRoot = MeshBuilder.CreateBox(
    "bbMesh1",
    {
      width: boundingBox.extendSizeWorld.x * 2,
      height: boundingBox.extendSizeWorld.y * 2,
      depth: boundingBox.extendSizeWorld.z * 2,
    },
    scene,
  );

  const mat = new StandardMaterial("mat");
  mat.diffuseColor = Color3.Green();
  mat.alpha = 0.7;
  newRoot.material = mat;

  newRoot.position = boundingBox.centerWorld;
  newRoot.rotation = mesh.rotation.clone();
}
