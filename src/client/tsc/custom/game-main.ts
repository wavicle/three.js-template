import {
  Camera,
  HemisphereLight,
  Intersection,
  Mesh,
  Scene,
  Vector3,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Utils3d } from "../framework/Utils3d";

const gltfLoader = new GLTFLoader();

export function init(scene: Scene, camera: Camera) {
  /** Lights */
  scene.add(new HemisphereLight("#FFFFFF", "#222222", 2));
  scene.add(
    Utils3d.pointLight({
      color: "#FFFFFF",
      intensity: 1,
      position: new Vector3(0, 10, 0),
    })
  );

  /** Camera */
  camera.position.set(0, 4, 15);

  /** Action! */
  gltfLoader.load(
    "gltf/scene.glb",
    (it) => {
      const suzanne = it.scene.getObjectByName("Suzanne") as Mesh;
      const floor = it.scene.getObjectByName("Floor") as Mesh;

      scene.add(suzanne);
      scene.add(floor);

      Utils3d.setIntersectable(suzanne);
    },
    (e) => console.log(e),
    (e) => console.log(e)
  );
}

export function animate(time: number, scene: Scene, camera: Camera) {
  (scene.getObjectByName("Suzanne") as Mesh).rotation.y += 0.01;
}

export function onClick(intersections: Intersection[]) {
  const mesh = intersections[0].object as Mesh;
  mesh.material = Utils3d.coloredMaterial(Utils3d.getRandomColor());
}
