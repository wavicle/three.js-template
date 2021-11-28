import * as THREE from "three";
import { Material, MeshPhongMaterial, Texture, TextureLoader } from "three";

const textureLoader = new TextureLoader();

export function coloredMaterial(color: string): Material {
  return new MeshPhongMaterial({ color: color });
}

export function textureFromUrl(url: string): Texture {
  return textureLoader.load(url);
}

export function metalMaterial(): Material {
  return new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 0.5,
  });
}
