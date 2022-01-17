import { Camera, Clock, Material, Mesh, Scene } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { SceneSupport } from "./SceneSupport";
import { UI } from "./UI";

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
    this.loader.load(this.url, (gltf) => this.onGLTFLoaded(gltf, scene, camera), this.onLoadProgress, this.onLoadError);
  }

  animate(scene: Scene, camera: Camera, clock: Clock): void {
    if (this.gltf) {
      this.support.animate(scene, camera, clock);
    }
  }

  private onGLTFLoaded(gltf: GLTF, scene: Scene, camera: Camera): void {
    this.gltf = gltf;
    gltf.scene.traverse(function (node) {
      if (node instanceof Mesh) {
        UI.addMesh(node);
        node.castShadow = true;
        node.receiveShadow = true;
        console.log("Loaded: ", node.name);
      }
    });
    scene.add(gltf.scene);
    const invisibleOp = scene.getObjectByName("Invisible");
    if (invisibleOp) {
      const invisibles = invisibleOp as Mesh;
      invisibles.children.forEach((it) => {
        if (it instanceof Mesh) {
          (it.material as Material).visible = false;
        }
      });
    }
    this.support.prepare(scene, camera);
  }

  getEyeHeight(): number {
    return this.support.getEyeHeight();
  }
}
