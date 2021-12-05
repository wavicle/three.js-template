import { Scene } from "three";

export interface SceneSupport {
  populate(scene: Scene): void;

  animate(scene: Scene, time: number): void;
}
