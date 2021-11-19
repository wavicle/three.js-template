import * as THREE from "three";
import { Camera, Mesh, Scene } from "three";
import { Configuration, DEBUG_CONFIG } from "./Configuration";

let cube: Mesh;

export function configure(): Configuration {
  return DEBUG_CONFIG;
}

export function init(scene: Scene, camera: Camera) {
  camera.position.z = 1;
  const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const material = new THREE.MeshNormalMaterial();

  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}

export function animate(time: number, scene: Scene, camera: Camera) {
  cube.rotation.x = time / 1000;
  cube.rotation.y = time / 1000;
}
