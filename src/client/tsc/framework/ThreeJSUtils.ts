import * as THREE from "three";
import {
  Material,
  MeshPhongMaterial,
  PointLight,
  Texture,
  TextureLoader,
  Vector3,
} from "three";
import { ObjectCache } from "./ObjectCache";

const textureLoader = new TextureLoader();

export const ThreeJSUtils = {
  coloredMaterial: function (color: string): Material {
    return new MeshPhongMaterial({ color: color });
  },

  textureFromUrl: function (url: string): Texture {
    return textureLoader.load(url);
  },

  texturedMaterial: function (texture: Texture): Material {
    return new MeshPhongMaterial({ map: texture });
  },

  texturedMaterialFromUrl: function (url: string): Material {
    return this.texturedMaterial(this.textureFromUrl(url));
  },

  metalMaterial: function (): Material {
    return new THREE.MeshStandardMaterial({
      metalness: 1,
      roughness: 0.5,
    });
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
    ObjectCache.addLight(light);
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
};
