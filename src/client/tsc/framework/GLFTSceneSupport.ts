import { Camera, Event, Intersection, Object3D, Scene } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { SceneSupport } from "./SceneSupport";

export class GLTFSceneSupport implements SceneSupport {
  private loader: GLTFLoader = new GLTFLoader();
  private gltf?: GLTF;

  constructor(
    private readonly url: string,
    private readonly support: SceneSupport,
    private readonly onLoadProgress?: (e: ProgressEvent) => void,
    private readonly onLoadError?: (e: ErrorEvent) => void
  ) {}

  prepare(scene: Scene, camera: Camera): void {
    this.loader.load(
      this.url,
      (gltf) => this.onGLTFLoaded(gltf, scene, camera),
      this.onLoadProgress,
      this.onLoadError
    );
  }

  animate(scene: Scene, camera: Camera, time: number): void {
    if (this.gltf) {
      this.support.animate(scene, camera, time);
    }
  }

  onClick(intersections: Intersection[], scene: Scene, camera: Camera): void {
    this.support.onClick(intersections, scene, camera);
  }

  private onGLTFLoaded(gltf: GLTF, scene: Scene, camera: Camera): void {
    this.gltf = gltf;
    scene.add(gltf.scene);
    this.support.prepare(scene, camera);
  }
}
