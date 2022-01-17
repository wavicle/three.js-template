import { Intersection, Mesh } from "three";

const meshesByName: { [key: string]: Mesh } = {};

export interface UIEvent {
  intersection: Intersection;
}

export interface KeyboardEvent extends UIEvent {
  keys: string[];
}

export interface KeyPressEvent extends KeyboardEvent {}

export interface MouseEvent extends UIEvent {}

export interface MouseClickEvent extends MouseEvent {}

export interface MouseEnterEvent extends MouseEvent {}

export interface MouseLeaveEvent extends MouseEvent {}

const intersectables: Mesh[] = [];
const clickHandlers: Map<Mesh, () => void> = new Map();
const mouseEnterHandlers: Map<Mesh, () => void> = new Map();
const mouseLeaveHandlers: Map<Mesh, () => void> = new Map();
const keyPressHandlers: Map<Mesh, (e: KeyPressEvent) => void> = new Map();

export const UI = {
  addMesh(mesh: Mesh) {
    meshesByName[mesh.name] = mesh;
  },

  getMesh(name: string): Mesh | undefined {
    return meshesByName[name];
  },

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

  onKeyPress: function (mesh: Mesh, handler: (e: KeyPressEvent) => void): void {
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

  getKeyPressHandler: function (mesh: Mesh): (e: KeyPressEvent) => void {
    return keyPressHandlers.get(mesh) as () => void;
  },

  showTooltip: function (html: string) {
    const promptElement = document.getElementById("tooltip") as HTMLElement;
    promptElement.innerHTML = html;
    promptElement.style.display = "block";
  },

  hideTooltip: function () {
    const promptElement = document.getElementById("tooltip") as HTMLElement;
    promptElement.innerHTML = "";
    promptElement.style.display = "none";
  },
};
