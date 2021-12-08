import { Mesh } from "three";

const intersectables: Mesh[] = [];
const clickHandlers: Map<Mesh, () => void> = new Map();
const mouseEnterHandlers: Map<Mesh, () => void> = new Map();
const mouseLeaveHandlers: Map<Mesh, () => void> = new Map();
const keyPressHandlers: Map<Mesh, () => void> = new Map();

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

  onKeyPress: function (mesh: Mesh, handler: () => void): void {
    keyPressHandlers.set(mesh, handler);
    intersectables.push(mesh);
  },

  isIntersectable: function (mesh: Mesh): boolean {
    return intersectables.indexOf(mesh) > -1;
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

  getKeyPressHandler: function (mesh: Mesh): () => void {
    return keyPressHandlers.get(mesh) as () => void;
  },

  showPrompt: function (html: string) {
    const promptElement = document.getElementById("prompt") as HTMLElement;
    promptElement.innerHTML = html;
    promptElement.style.display = "block";
  },

  hidePrompt: function () {
    const promptElement = document.getElementById("prompt") as HTMLElement;
    promptElement.innerHTML = "";
    promptElement.style.display = "none";
  },
};
