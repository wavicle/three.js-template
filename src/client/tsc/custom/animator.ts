import { Camera, HemisphereLight, Scene, Vector3 } from "three";
import { Box3d } from "../framework/Box3d";
import { Configuration } from "../framework/Configuration";
import { ObjectThreeDim } from "../framework/ObjectThreeDim";
import { ThreeJSUtils } from "../framework/ThreeJSUtils";

let floor: Box3d;
let cubes: ObjectThreeDim[] = [];

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
      color: "#FF0000",
      intensity: 1,
      position: new Vector3(0, 20, 0),
    })
  );

  for (var i = 1; i <= 10; i++) {
    const cube = new Box3d({
      name: "MyCube_" + i,
      position: {
        x: i * 2,
        y: i * 2,
        z: i * 2,
      },
      width: 1,
      height: 1,
      depth: 1,
      material: ThreeJSUtils.coloredMaterial(ThreeJSUtils.getRandomColor()),
      onClick: function (self: ObjectThreeDim) {
        self.raw.material = ThreeJSUtils.coloredMaterial(
          ThreeJSUtils.getRandomColor()
        );
      },
    });
    cubes.push(cube);
    scene.add(cube.raw);
  }

  floor = new Box3d({
    name: "Floor",
    width: 40,
    height: 1,
    depth: 40,
    material: ThreeJSUtils.texturedMaterialFromUrl("images/dirty_concrete.jpg"),
  });
  scene.add(floor.raw);
}

export function animate(time: number, scene: Scene, camera: Camera) {
  cubes.forEach((cube) => {
    cube.raw.rotation.x += 0.01;
  });
}
