import {
  Material,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PointLight,
  Texture,
  Vector3,
} from "three";
import { GLTFSceneSupport } from "./GLFTSceneSupport";
import { SceneSupport } from "./SceneSupport";

const intersectables: Mesh[] = [];

export const Utils3d = {
  startWithGLTF(
    url: string,
    support: SceneSupport,
    onLoadProgress?: (e: ProgressEvent) => void,
    onLoadError?: (e: ErrorEvent) => void
  ): SceneSupport {
    return new GLTFSceneSupport(url, support, onLoadProgress, onLoadError);
  },

  coloredMaterial: function (color: string): Material {
    return new MeshPhongMaterial({ color: color });
  },

  texturedMaterial: function (texture: Texture): Material {
    return new MeshPhongMaterial({ map: texture });
  },

  pointLight: function (params: {
    color: string;
    intensity: number;
    position?: Vector3;
  }) {
    const light = new PointLight(params.color, params.intensity);
    if (params.position) {
      light.position.copy(params.position);
    }
    light.castShadow = true;
    return light;
  },

  getRandomColor: function () {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },

  isIntersectable: function (mesh: Mesh) {
    return intersectables.indexOf(mesh) > -1;
  },

  setIntersectable: function (mesh: Mesh) {
    if (!this.isIntersectable(mesh)) {
      intersectables.push(mesh);
    }
  },

  getIntersectables: function (): Object3D[] {
    return intersectables;
  },
};
