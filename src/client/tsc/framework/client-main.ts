import * as THREE from "three";
import $ from "jquery";
import { sceneSupport } from "../custom/game";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

import {
  Intersection,
  Mesh,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { UI } from "./UI";
import { Utils3d } from "./Utils3d";

let running: boolean = false;

let renderer: WebGLRenderer, camera: PerspectiveCamera, scene: Scene;
let pointerLockControls: PointerLockControls;

const raycaster = new THREE.Raycaster();
let clicked: boolean = false;
let pressedKeyCode: undefined | string = undefined;
let previousMouseTarget: Mesh | undefined;
let previousKeyboardTarget: Mesh | undefined;

$(function () {
  window.addEventListener("click", function (event) {
    if (running) {
      clicked = true;
    }
    if (pointerLockControls && !pointerLockControls.isLocked) {
      pointerLockControls.lock();
      unlockGame();
    }
  });

  const speed = 0.25;
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
      default:
        pressedKeyCode = event.code;
        break;
    }
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
  renderer.setAnimationLoop(animateIfNeeded);
  document.body.appendChild(renderer.domElement);

  initFromConfig();
  sceneSupport.prepare(scene, camera);
});

function animateIfNeeded(time: number): void {
  if (running) {
    animateWithUI();
    sceneSupport.animate(scene, camera, time);
    renderer.render(scene, camera);
  }
}

type MouseEventType = { code: "enter" | "leave" | "click"; target: Mesh };

function animateWithUI() {
  raycaster.set(camera.position, camera.getWorldDirection(new Vector3()));

  const intersections = raycaster.intersectObjects(scene.children, true) || [];
  let target: undefined | Mesh = undefined;
  if (intersections.length > 0) {
    const firstIntersection = intersections[0];
    const firstObject = firstIntersection.object;
    if (
      firstObject instanceof Mesh &&
      UI.isIntersectable(firstObject as Mesh)
    ) {
      target = firstObject as Mesh;
    }
  }
  animateWithKeyboard(target);
  animateWithMouse(target);
}

function animateWithKeyboard(target: undefined | Mesh): void {
  if (target && pressedKeyCode) {
    const handler = UI.getKeyPressHandler(target);
    if (handler) {
      handler();
    }
  }
  previousKeyboardTarget = target;
  pressedKeyCode = undefined;
}

function animateWithMouse(target: undefined | Mesh): void {
  let mouseEvents: MouseEventType[] = [];
  if (target) {
    if (clicked) {
      clicked = false;
      mouseEvents.push({ code: "click", target: target });
    } else if (previousMouseTarget) {
      if (previousMouseTarget != target) {
        mouseEvents.push({ code: "leave", target: previousMouseTarget });
        mouseEvents.push({ code: "enter", target: target });
      }
    } else {
      mouseEvents.push({ code: "enter", target: target });
    }
  } else {
    if (previousMouseTarget) {
      mouseEvents.push({ code: "leave", target: previousMouseTarget });
    }
  }
  previousMouseTarget = target;

  mouseEvents.forEach((mouseEvent) => {
    let handler: (() => void) | undefined = undefined;
    const code = mouseEvent.code;
    const target = mouseEvent.target;
    if (code == "click") {
      handler = UI.getClickHandler(target);
    } else if (code == "leave") {
      handler = UI.getMouseLeaveHandler(target);
    } else if (code == "enter") {
      handler = UI.getMouseEnterHandler(target);
    }
    if (handler) {
      handler();
    }
  });
}

function initFromConfig() {
  pointerLockControls = new PointerLockControls(camera, renderer.domElement);
  pointerLockControls.addEventListener("unlock", function () {
    lockGame();
  });
  lockGame();
}

function lockGame() {
  running = false;
  UI.showPrompt("Click anywhere to continue");
  (document.getElementById("personCursor") as HTMLElement).style.display =
    "none";
}

function unlockGame() {
  UI.hidePrompt();
  (document.getElementById("prompt") as HTMLElement).style.display = "none";
  (document.getElementById("personCursor") as HTMLElement).style.display =
    "block";
  running = true;
}
