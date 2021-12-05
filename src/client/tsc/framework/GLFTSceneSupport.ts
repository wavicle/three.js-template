import { Scene } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { SceneSupport } from "./SceneSupport";

export class GLTFSceneSupport implements SceneSupport {
  private readonly loader: GLTFLoader = new GLTFLoader();
  private gltf?: GLTF;

  constructor(
    private readonly url: string,
    private readonly support: SceneSupport,
    private readonly onLoadProgress?: (e: ProgressEvent) => void,
    private readonly onLoadError?: (e: ErrorEvent) => void
  ) {}

  populate(scene: Scene): void {
    this.loader.load(
      this.url,
      (gltf) => this.onGLTFLoaded(gltf, scene),
      this.onLoadProgress,
      this.onLoadError
    );
  }

  animate(scene: Scene, time: number): void {
    if (this.gltf) {
      this.support.animate(scene, time);
    }
  }

  private onGLTFLoaded(gltf: GLTF, scene: Scene): void {
    this.gltf = gltf;
    scene.add(gltf.scene);
  }
}
