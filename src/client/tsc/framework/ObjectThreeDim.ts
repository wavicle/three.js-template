import { BufferGeometry, Material, Mesh, Vector3 } from "three";
import { ObjectCache } from "./ObjectCache";

export interface ObjectThreeDimCommonParams {
  name?: string;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  rotation?: Vector3;
  material: Material | Material[] | undefined;
  onClick?: () => void;
}

export class ObjectThreeDim {
  private _mesh: Mesh;
  private _onClick?: () => void;

  protected constructor(
    shape: BufferGeometry,
    params: ObjectThreeDimCommonParams
  ) {
    const mesh = new Mesh(shape, params.material);
    mesh.name = params.name || "Unnamed";
    if (params.position) {
      mesh.position.x = params.position.x;
      mesh.position.y = params.position.y;
      mesh.position.z = params.position.z;
    }
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    this._mesh = mesh;
    this._onClick = params.onClick;
    ObjectCache.add(this);
  }

  get name(): string {
    return this._mesh.name;
  }

  set name(name: string) {
    this._mesh.name = name;
  }

  get material(): Material | Material[] {
    return this._mesh.material;
  }

  set material(material: Material | Material[]) {
    this._mesh.material = material;
  }

  get position(): Vector3 {
    return this._mesh.position;
  }

  get onClick(): (() => void) | undefined {
    return this._onClick;
  }

  set onClick(handler: (() => void) | undefined) {
    this._onClick = handler;
  }

  get raw(): Mesh {
    return this._mesh;
  }
}
