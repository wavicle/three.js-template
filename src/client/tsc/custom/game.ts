import { Camera, Clock, HemisphereLight, Mesh, Scene, Vector3 } from "three";
import { SceneSupport } from "../framework/SceneSupport";
import { Utils3d } from "../framework/Utils3d";
import { KeyPressEvent, UI } from "../framework/UI";

class BasicSceneSupport implements SceneSupport {
  prepare(scene: Scene, camera: Camera): void {
    camera.position.set(5, 7, 10);

    scene.add(new HemisphereLight("#FFFFFF", "#222222", 2));
    scene.add(
      Utils3d.pointLight({
        color: "#FFFFFF",
        intensity: 1,
        position: new Vector3(0, 10, 0),
      })
    );

    const suzanne = scene.getObjectByName("Suzanne") as Mesh;
    const sphere = scene.getObjectByName("Sphere") as Mesh;

    UI.onClick(suzanne, () => {
      suzanne.material = Utils3d.coloredMaterial(Utils3d.getRandomColor());
    });
    UI.onMouseEnter(suzanne, () => {
      UI.showTooltip("Click to change color");
    });
    UI.onMouseLeave(suzanne, () => {
      UI.hideTooltip();
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

  animate(scene: Scene, camera: Camera, clock: Clock): void {
    (scene.getObjectByName("Suzanne") as Mesh).rotation.y +=
      clock.getDelta() * 0.5;
  }

  getEyeHeight(): number {
    return 6;
  }
}

export const sceneSupport: SceneSupport = Utils3d.startWithGLTF(
  "gltf/scene.glb",
  new BasicSceneSupport()
);
