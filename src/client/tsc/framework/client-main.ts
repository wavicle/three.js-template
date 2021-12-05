import * as THREE from "three";
import $ from "jquery";
import { configure, init, animate, onClick } from "../custom/animator";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

import { Mesh, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { Configuration } from "./Configuration";
import { Utils3d } from "./ThreeJSUtils";

let running: boolean = false;

let renderer: WebGLRenderer, camera: PerspectiveCamera, scene: Scene;
let pointerLockControls: PointerLockControls;
let clicked: boolean;
let config: Configuration;

const raycaster = new THREE.Raycaster();

$(function () {
  config = configure();
  clicked = false;
  window.addEventListener("click", function (event) {
    processMouseClick();
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
          break;
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
  renderer.setAnimationLoop(animateIfNeeded);
  document.body.appendChild(renderer.domElement);

  initFromConfig();
  init(scene, camera);
});

function animateIfNeeded(time: number): void {
  if (running) {
    processMouseEvents();
    animate(time, scene, camera);
    renderer.render(scene, camera);
  }
}

function processMouseClick() {
  if (running) {
    clicked = true;
  }
  if (pointerLockControls && !pointerLockControls.isLocked) {
    pointerLockControls.lock();
    unlockGame();
  }
}

function processMouseEvents() {
  if (clicked) {
    clicked = false;
    raycaster.set(camera.position, camera.getWorldDirection(new Vector3()));
    const intersections = raycaster.intersectObjects(
      scene.children
        .filter((it) => it instanceof Mesh)
        .filter((it) => Utils3d.isIntersectable(it as Mesh))
    );
    if (intersections && intersections.length > 0) {
      onClick(intersections);
    }
  }
}

function initFromConfig() {
  if (config.firstPersonNavigation) {
    pointerLockControls = new PointerLockControls(camera, renderer.domElement);
    pointerLockControls.addEventListener("unlock", function () {
      lockGame();
    });
    lockGame();
  }
}

function lockGame() {
  running = false;
  (document.getElementById("pointerLockPrompt") as HTMLElement).style.display =
    "block";
  (document.getElementById("personCursor") as HTMLElement).style.display =
    "none";
}

function unlockGame() {
  running = true;
  (document.getElementById("pointerLockPrompt") as HTMLElement).style.display =
    "none";
  (document.getElementById("personCursor") as HTMLElement).style.display =
    "block";
}
