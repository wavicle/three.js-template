import { Camera, Clock, HemisphereLight, Mesh, Scene, Vector3 } from "three";
import { SceneSupport } from "../framework/SceneSupport";
import { Utils3d } from "../framework/Utils3d";
import { UI } from "../framework/UI";

class BasicSceneSupport implements SceneSupport {
  private doorOpen: boolean = false;

  prepare(scene: Scene, camera: Camera): void {
    camera.position.set(0, 6.5, 0);

    scene.add(new HemisphereLight("#FFFFFF", "#222222", 1));
    /** Main room light */
    scene.add(
      Utils3d.pointLight({
        color: "#BBBBAA",
        intensity: 1,
        position: new Vector3(0, 8, 0),
      })
    );
    /** Joe's room light */
    scene.add(
      Utils3d.pointLight({
        color: "#BBBBAA",
        intensity: 0.5,
        position: new Vector3(-15, 8, -10),
      })
    );

    const door = UI.getMesh("Yellow_Door") as Mesh;
    const self = this;
    function prepareDoorKnob(knob: Mesh) {
      UI.onMouseEnter(knob, () => {
        UI.showTooltip("Door<br> <b>[F]</b> " + (self.doorOpen ? "Close door" : "Open door"));
      });
      UI.onMouseLeave(knob, () => {
        UI.hideTooltip();
      });
      UI.onKeyPress(knob, (e) => {
        if (e.keys.includes("KeyF")) {
          door.rotation.y += self.doorOpen ? -Math.PI / 2 : Math.PI / 2;
          self.doorOpen = !self.doorOpen;
        }
      });
    }

    prepareDoorKnob(UI.getMesh("Yellow_Door_Knob_1") as Mesh);
    prepareDoorKnob(UI.getMesh("Yellow_Door_Knob_2") as Mesh);
  }

  animate(scene: Scene, camera: Camera, clock: Clock): void {}

  getEyeHeight(): number {
    return 5.5;
  }
}

export const sceneSupport: SceneSupport = Utils3d.startWithGLTF("gltf/rooms.glb", new BasicSceneSupport());
