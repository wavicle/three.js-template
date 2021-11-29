import { Camera, Scene } from "three";
import { Box3d } from "./Box3d";
import { Configuration, DEFAULT_CONFIG } from "./Configuration";
import { coloredMaterial, texturedMaterialFromUrl } from "./ThreeJSUtils";

let cube: Box3d;

export function configure(): Configuration {
  return DEFAULT_CONFIG;
}

export function init(scene: Scene, camera: Camera) {
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
    material: coloredMaterial("#FF0000"),
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
    material: texturedMaterialFromUrl("images/dirty_concrete.jpg"),
    onClick: function () {
      alert("Why did you click the floor?");
    },
  });
  scene.add(floor.raw);

  alert("Try clicking somewhere!");
}

export function animate(time: number, scene: Scene, camera: Camera) {
  cube.raw.rotation.y += 0.01;
}
