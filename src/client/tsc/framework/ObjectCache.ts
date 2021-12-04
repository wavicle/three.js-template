import { Light, Mesh } from "three";
import { ObjectThreeDim } from "./ObjectThreeDim";

const cache = new Map<string, ObjectThreeDim>();
const intersectables: Mesh[] = [];
const lights: Light[] = [];

export const ObjectCache = {
  add: function (obj: ObjectThreeDim) {
    cache.set(obj.name, obj);
  },
  get: function (name: string): ObjectThreeDim | undefined {
    return cache.get(name);
  },
  addIntersectable: function (mesh: Mesh) {
    if (intersectables.indexOf(mesh) < 0) {
      intersectables.push(mesh);
    }
  },
  getIntersectables: function (): Mesh[] {
    return intersectables;
  },
  addLight(light: Light) {
    lights.push(light);
  },
  getLights: function () {
    return lights;
  },
};
