import { Camera, Clock, Scene } from "three";

export interface SceneSupport {
  prepare(scene: Scene, camera: Camera): void;

  animate(scene: Scene, camera: Camera, clock: Clock): void;

  getEyeHeight(): number;
}
