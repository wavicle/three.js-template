import { Mesh } from "three";

const intersectables: Mesh[] = [];
const clickHandlers: Map<Mesh, () => void> = new Map();
const mouseEnterHandlers: Map<Mesh, () => void> = new Map();
const mouseLeaveHandlers: Map<Mesh, () => void> = new Map();

export const UI = {
  onClick: function (mesh: Mesh, handler: () => void): void {
    clickHandlers.set(mesh, handler);
    intersectables.push(mesh);
  },

  onMouseEnter: function (mesh: Mesh, handler: () => void): void {
    mouseEnterHandlers.set(mesh, handler);
    intersectables.push(mesh);
  },

  onMouseLeave: function (mesh: Mesh, handler: () => void): void {
    mouseLeaveHandlers.set(mesh, handler);
    intersectables.push(mesh);
  },

  getIntersectables: function (): Mesh[] {
    return intersectables;
  },

  getClickHandler: function (mesh: Mesh): () => void {
    return clickHandlers.get(mesh) as () => void;
  },

  getMouseEnterHandler: function (mesh: Mesh): () => void {
    return mouseEnterHandlers.get(mesh) as () => void;
  },

  getMouseLeaveHandler: function (mesh: Mesh): () => void {
    return mouseLeaveHandlers.get(mesh) as () => void;
  },
};
