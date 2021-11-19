import * as THREE from "three";
import $ from "jquery";
import { configure, init, animate } from "./animator";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Camera, Scene, WebGLRenderer } from "three";
import { Configuration } from "./Configuration";
import Stats from "three/examples/jsm/libs/stats.module";

let renderer: WebGLRenderer, camera: Camera, scene: Scene;
let orbitControls: OrbitControls, stats: Stats;

$(function () {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  );
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  window.addEventListener("resize", function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  renderer.setAnimationLoop(function (time) {
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

function initFromConfig(config: Configuration) {
  if (config.orbitControls) {
    orbitControls = new OrbitControls(camera, renderer.domElement);
  }
  if (config.stats) {
    stats = Stats();
    document.body.appendChild(stats.dom);
  }
}
