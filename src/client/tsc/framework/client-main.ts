import * as THREE from "three";
import $ from "jquery";
import { sceneSupport } from "../custom/game";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

import { Mesh, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { UI } from "./UI";

let running: boolean = false;

let renderer: WebGLRenderer, camera: PerspectiveCamera, scene: Scene;
let pointerLockControls: PointerLockControls;

const raycaster = new THREE.Raycaster();
let clicked: boolean = false;
let previousMouseTarget: Mesh | undefined;

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
    animateWithMouse();
    sceneSupport.animate(scene, camera, time);
    renderer.render(scene, camera);
  }
}

function animateWithMouse() {
  raycaster.set(camera.position, camera.getWorldDirection(new Vector3()));
  const intersections = raycaster.intersectObjects(UI.getIntersectables());

  type MouseEventType = { code: "enter" | "leave" | "click"; target: Mesh };
  let mouseEvents: MouseEventType[] = [];
  if (intersections && intersections.length > 0) {
    const target = intersections[0].object as Mesh;
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
    previousMouseTarget = target;
  } else if (previousMouseTarget) {
    mouseEvents.push({ code: "leave", target: previousMouseTarget });
    previousMouseTarget = undefined;
  }

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
