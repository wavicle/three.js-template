import { Camera, Mesh, Scene } from "three";
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

  private onGLTFLoaded(gltf: GLTF, scene: Scene, camera: Camera): void {
    this.gltf = gltf;
    gltf.scene.traverse(function (node) {
      if (node instanceof Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    scene.add(gltf.scene);
    this.support.prepare(scene, camera);
  }
}
