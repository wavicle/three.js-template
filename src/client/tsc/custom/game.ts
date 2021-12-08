import {
  BoxGeometry,
  Camera,
  HemisphereLight,
  Mesh,
  MeshNormalMaterial,
  Scene,
  SphereGeometry,
  Vector3,
} from "three";
import { SceneSupport } from "../framework/SceneSupport";
import { Utils3d } from "../framework/Utils3d";
import { KeyPressEvent, UI } from "../framework/UI";

class BasicSceneSupport implements SceneSupport {
  prepare(scene: Scene, camera: Camera): void {
    camera.position.set(0, 4, 10);

    scene.add(new HemisphereLight("#FFFFFF", "#222222", 2));
    scene.add(
      Utils3d.pointLight({
        color: "#FFFFFF",
        intensity: 1,
        position: new Vector3(0, 10, 0),
      })
    );

    const cube = new Mesh(
      new BoxGeometry(1, 1, 1),
      Utils3d.coloredMaterial("#FF0000")
    );
    cube.name = "cube";
    cube.position.x = 3;
    cube.position.y = 1;
    scene.add(cube);

    UI.onClick(scene.getObjectByName("Suzanne") as Mesh, () => {
      (scene.getObjectByName("Suzanne") as Mesh).material =
        Utils3d.coloredMaterial(Utils3d.getRandomColor());
    });

    UI.onMouseEnter(scene.getObjectByName("cube") as Mesh, () => {
      (scene.getObjectByName("cube") as Mesh).material =
        Utils3d.coloredMaterial("#FFFF00");
    });

    UI.onMouseLeave(scene.getObjectByName("cube") as Mesh, () => {
      (scene.getObjectByName("cube") as Mesh).material =
        Utils3d.coloredMaterial("#FF0000");
    });

    var sphere = new Mesh(new SphereGeometry(1), new MeshNormalMaterial());
    sphere.name = "sphere";
    sphere.position.x = -3;
    sphere.position.z = 2;
    scene.add(sphere);

    UI.onMouseEnter(sphere, () => {
      UI.showTooltip("Press [F] to change color");
    });
    UI.onMouseLeave(sphere, () => {
      UI.hideTooltip();
    });

    UI.onKeyPress(sphere, (e: KeyPressEvent) => {
      if (e.keys[0] == "KeyF") {
        (e.intersection.object as Mesh).material = Utils3d.coloredMaterial(
          Utils3d.getRandomColor()
        );
      }
    });
  }

  animate(scene: Scene, camera: Camera, time: number): void {
    (scene.getObjectByName("Suzanne") as Mesh).rotation.y += 0.01;
  }
}

export const sceneSupport: SceneSupport = Utils3d.startWithGLTF(
  "gltf/scene.glb",
  new BasicSceneSupport()
);