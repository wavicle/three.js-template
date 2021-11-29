import * as THREE from "three";
import $ from "jquery";
import { configure, init, animate } from "./animator";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  HemisphereLight,
  Mesh,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import { Configuration } from "./Configuration";
import Stats from "three/examples/jsm/libs/stats.module";
import { ObjectCache } from "./ObjectCache";

let renderer: WebGLRenderer, camera: PerspectiveCamera, scene: Scene;
let orbitControls: OrbitControls, stats: Stats;
let mouse: Vector2, clicked: boolean;

const raycaster = new THREE.Raycaster();

$(function () {
  clicked = false;
  window.addEventListener("click", function (event) {
    mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    clicked = true;
  });

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    2000
  );
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  renderer.shadowMap.enabled = true;
  renderer.setAnimationLoop(function (time) {
    processMouseEvents();

    animate(time, scene, camera);
    if (orbitControls) {
      orbitControls.update();
    }
    if (stats) {
      stats.update();
    }
    renderer.render(scene, camera);
  });
  document.body.appendChild(renderer.domElement);

  initFromConfig(configure());
  init(scene, camera);
});

function processMouseEvents() {
  if (clicked) {
    raycaster.setFromCamera(mouse, camera);
    const intersections = raycaster.intersectObjects(scene.children) || [];
    if (intersections && intersections.length > 0) {
      const objectName = (intersections[0].object as Mesh).name;
      const higherObject = ObjectCache.get(objectName);
      if (higherObject?.onClick) {
        higherObject.onClick();
      }
    }
    clicked = false;
  }
}

function initFromConfig(config: Configuration) {
  camera.position.z = 20;
  camera.position.y = 10;
  if (config.orbitControls) {
    orbitControls = new OrbitControls(camera, renderer.domElement);
  }
  if (config.stats) {
    stats = Stats();
    document.body.appendChild(stats.dom);
  }
  if (config.gridHelper) {
    scene.add(new THREE.GridHelper(1000, 1000));
  }
  if (config.defaultLights.point) {
    const light = new PointLight("#FFFFFF", 1);
    light.position.y = 20;
    light.castShadow = true;
    scene.add(light);
  }
  if (config.defaultLights.hemisphere) {
    scene.add(new HemisphereLight("#FFFFFF", "111111", 0.4));
  }
}
