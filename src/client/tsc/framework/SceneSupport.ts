import { Camera, Scene } from "three";

export interface SceneSupport {
  prepare(scene: Scene, camera: Camera): void;

  animate(scene: Scene, camera: Camera, time: number): void;
}
