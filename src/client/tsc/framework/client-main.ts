import * as THREE from "three";
import $ from "jquery";
import { configure, init, animate } from "../custom/animator";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

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
import { ObjectCache } from "./ObjectCache";

let renderer: WebGLRenderer, camera: PerspectiveCamera, scene: Scene;
let pointerLockControls: PointerLockControls;
let mouse: Vector2, clicked: boolean;
let config: Configuration;

const raycaster = new THREE.Raycaster();

$(function () {
  config = configure();
  clicked = false;
  document.body.style.cursor = "none";
  window.addEventListener("mousemove", function (event) {
    mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });
  window.addEventListener("click", function (event) {
    if (pointerLockControls && !pointerLockControls.isLocked) {
      pointerLockControls.lock();
      hidePointerLockPrompt();
    }
    clicked = true;
  });
  if (config.firstPersonNavigation) {
    const speed = config.firstPersonNavigation?.speed || 0;
    window.addEventListener("keypress", function (event) {
      switch (event.code) {
        case "KeyW":
          pointerLockControls.moveForward(speed);
          break;
        case "KeyS":
          pointerLockControls.moveForward(-speed);
          break;
        case "KeyA":
          pointerLockControls.moveRight(-speed);
          break;
        case "KeyD":
          pointerLockControls.moveRight(speed);
      }
    });
  }

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
    renderer.render(scene, camera);
  });
  document.body.appendChild(renderer.domElement);

  initFromConfig();
  init(scene, camera);
});

function processMouseEvents() {
  if (clicked) {
    clicked = false;
    raycaster.setFromCamera(mouse, camera);
    const intersections = raycaster.intersectObjects(scene.children) || [];
    if (intersections && intersections.length > 0) {
      const objectName = (intersections[0].object as Mesh).name;
      const higherObject = ObjectCache.get(objectName);
      if (higherObject?.onClick) {
        higherObject.onClick();
      }
    }
  }
}

function initFromConfig() {
  camera.position.z = 20;
  camera.position.y = 10;
  if (config.firstPersonNavigation) {
    pointerLockControls = new PointerLockControls(camera, renderer.domElement);
    pointerLockControls.unlock = showPointerLockPrompt;
    showPointerLockPrompt();
  }
}

function showPointerLockPrompt() {
  (document.getElementById("pointerLockPrompt") as HTMLElement).style.display =
    "block";
}

function hidePointerLockPrompt() {
  (document.getElementById("pointerLockPrompt") as HTMLElement).style.display =
    "none";
}
