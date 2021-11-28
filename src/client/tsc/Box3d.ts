import { BoxGeometry } from "three";
import { ObjectThreeDim, ObjectThreeDimCommonParams } from "./ObjectThreeDim";

interface Box3dParams extends ObjectThreeDimCommonParams {
  width: number;
  height: number;
  depth: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
}

export class Box3d extends ObjectThreeDim {
  constructor(params: Box3dParams) {
    super(
      new BoxGeometry(
        params.width,
        params.height,
        params.depth,
        params.widthSegments,
        params.heightSegments,
        params.depthSegments
      ),
      params
    );
  }
}
