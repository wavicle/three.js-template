import * as THREE from "three";
import $ from "jquery";
import { sceneSupport } from "../custom/game";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

import { Clock, Intersection, Mesh, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { UI } from "./UI";
import { FirstPerson } from "./FirstPerson";

let running: boolean = false;

let renderer: WebGLRenderer, camera: PerspectiveCamera, scene: Scene;
let pointerLockControls: PointerLockControls;

let clicked: boolean = false;
let pressedKeyCode: undefined | string = undefined;
let releasedKeyCode: undefined | string = undefined;
let previousMouseTarget: Mesh | undefined;
let previousKeyboardTarget: Mesh | undefined;

const movements: {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
} = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};
const speed = 0.08;

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

  window.addEventListener("keydown", function (event) {
    switch (event.code) {
      case "KeyW":
        movements.forward = true;
        break;
      case "KeyS":
        movements.backward = true;
        break;
      case "KeyA":
        movements.left = true;
        break;
      case "KeyD":
        movements.right = true;
        break;
      default:
        pressedKeyCode = event.code;
        break;
    }
  });
  window.addEventListener("keyup", function (event) {
    switch (event.code) {
      case "KeyW":
        movements.forward = false;
        break;
      case "KeyS":
        movements.backward = false;
        break;
      case "KeyA":
        movements.left = false;
        break;
      case "KeyD":
        movements.right = false;
        break;
      default:
        releasedKeyCode = event.code;
        break;
    }
  });

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 2000);
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.getElementById("outputCanvas") as HTMLElement,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  renderer.setAnimationLoop(animateIfNeeded);
  initFromConfig();
  sceneSupport.prepare(scene, camera);
});

const clock = new Clock();
function animateIfNeeded(): void {
  if (running) {
    animateWithUI();
    sceneSupport.animate(scene, camera, clock);
    renderer.render(scene, camera);
  }
}

type MouseEventType = { code: "enter" | "leave" | "click"; target: Mesh };

let firstPerson: FirstPerson;
function moveCamera() {
  const eyeHeight = sceneSupport.getEyeHeight();
  if (!firstPerson) {
    if (eyeHeight) {
      firstPerson = new FirstPerson(pointerLockControls, eyeHeight, speed, 0.25);
    }
  } else {
    firstPerson.moveFirstPerson(movements, clock.getDelta(), scene.children);
  }
}

const raycaster = new THREE.Raycaster();
function animateWithUI() {
  moveCamera();
  raycaster.set(camera.position, camera.getWorldDirection(new Vector3()));

  let firstIntersection: undefined | Intersection;
  const intersections = raycaster.intersectObjects(getVisibles(), true) || [];
  let target: undefined | Mesh = undefined;
  if (intersections.length > 0) {
    firstIntersection = intersections[0];
    const firstObject = firstIntersection.object;
    const intersectable = firstObject instanceof Mesh && UI.isIntersectable(firstObject as Mesh);
    const closeEnough = firstIntersection.distance <= sceneSupport.getEyeHeight();
    if (intersectable && closeEnough) {
      target = firstObject as Mesh;
    }
  }
  animateWithKeyboard(target, firstIntersection);
  animateWithMouse(target, firstIntersection);
}

function getVisibles(): Object3D[] {
  return scene.children;
}

function animateWithKeyboard(target: undefined | Mesh, intersection: undefined | Intersection): void {
  if (target && intersection && pressedKeyCode) {
    const handler = UI.getKeyPressHandler(target);
    if (handler) {
      handler({
        intersection: intersection,
        keys: [pressedKeyCode],
      });
    }
  }
  previousKeyboardTarget = target;
  pressedKeyCode = undefined;
}

function animateWithMouse(target: undefined | Mesh, intersection: undefined | Intersection): void {
  let mouseEvents: MouseEventType[] = [];
  if (target) {
    if (clicked) {
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
  clicked = false;
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
  const element = document.getElementById("pointerLockPrompt") as HTMLElement;
  element.innerHTML = "Click anywhere to continue";
  element.style.display = "block";
  (document.getElementById("personCursor") as HTMLElement).style.display = "none";
}

function unlockGame() {
  (document.getElementById("pointerLockPrompt") as HTMLElement).style.display = "none";
  (document.getElementById("personCursor") as HTMLElement).style.display = "block";
  running = true;
}
