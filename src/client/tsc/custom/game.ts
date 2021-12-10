import { Camera, HemisphereLight, Mesh, Scene, Vector3 } from "three";
import { SceneSupport } from "../framework/SceneSupport";
import { Utils3d } from "../framework/Utils3d";
import { KeyPressEvent, UI } from "../framework/UI";

class BasicSceneSupport implements SceneSupport {
  prepare(scene: Scene, camera: Camera): void {
    camera.position.set(0, 6, 10);

    scene.add(new HemisphereLight("#FFFFFF", "#222222", 2));
    scene.add(
      Utils3d.pointLight({
        color: "#FFFFFF",
        intensity: 1,
        position: new Vector3(0, 10, 0),
      })
    );

    const suzanne = scene.getObjectByName("Suzanne") as Mesh;
    const cube = scene.getObjectByName("Cube") as Mesh;
    const sphere = scene.getObjectByName("Sphere") as Mesh;

    UI.onClick(suzanne, () => {
      (scene.getObjectByName("Suzanne") as Mesh).material =
        Utils3d.coloredMaterial(Utils3d.getRandomColor());
    });

    UI.onMouseEnter(cube as Mesh, () => {
      (cube as Mesh).material = Utils3d.coloredMaterial("#FFFF00");
    });

    UI.onMouseLeave(cube as Mesh, () => {
      (cube as Mesh).material = Utils3d.coloredMaterial("#FF0000");
    });

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
