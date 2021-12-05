import { GLTFSceneSupport } from "../framework/GLFTSceneSupport";

export class MySceneSupport extends GLTFSceneSupport {
  protected onGLTFLoadProgress(e: ProgressEvent<EventTarget>): void {
    console.log(e);
  }

  protected onGLTFLoadError(e: ErrorEvent): void {
    throw e;
  }
}
