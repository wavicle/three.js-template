import { ObjectThreeDim } from "./ObjectThreeDim";

const cache = new Map<string, ObjectThreeDim>();

export const ObjectCache = {
  add: function (mesh: ObjectThreeDim) {
    cache.set(mesh.name, mesh);
  },
  get: function (name: string): ObjectThreeDim | undefined {
    return cache.get(name);
  },
};
