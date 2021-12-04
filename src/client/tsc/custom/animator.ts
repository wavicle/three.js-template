import { Camera, HemisphereLight, Scene, Vector3 } from "three";
import { Box3d } from "../framework/Box3d";
import { Configuration } from "../framework/Configuration";
import { ThreeJSUtils } from "../framework/ThreeJSUtils";

let cube: Box3d;

export function configure(): Configuration {
  return {
    firstPersonNavigation: {
      speed: 1,
    },
  };
}

export function init(scene: Scene, camera: Camera) {
  scene.add(new HemisphereLight("#FFFFFF", "#000000", 1));
  scene.add(
    ThreeJSUtils.pointLight({
      color: "#FFFFFF",
      intensity: 1,
      position: new Vector3(0, 20, 0),
    })
  );

  cube = new Box3d({
    name: "MyCube",
    position: {
      x: 0,
      y: 5,
      z: 0,
    },
    width: 5,
    height: 5,
    depth: 5,
    material: ThreeJSUtils.coloredMaterial("#00FF00"),
    onClick: function () {
      alert("You clicked the cube!");
    },
  });
  scene.add(cube.raw);

  const floor = new Box3d({
    name: "Floor",
    width: 40,
    height: 1,
    depth: 40,
    material: ThreeJSUtils.texturedMaterialFromUrl("images/dirty_concrete.jpg"),
    onClick: function () {
      alert("Why did you click the floor?");
    },
  });
  scene.add(floor.raw);
}

export function animate(time: number, scene: Scene, camera: Camera) {
  cube.raw.rotation.y += 0.01;
}
