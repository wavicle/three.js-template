import { Camera, Object3D, Raycaster, Vector3 } from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

export class FirstPerson {
  constructor(
    private controls: PointerLockControls,
    private eyeHeight: number,
    private speed: number,
    private wiggleRoom: number
  ) {}

  private getDistance(
    origin: Vector3,
    objects: Object3D[],
    direction: Vector3
  ): number {
    const raycaster = new Raycaster();
    raycaster.set(origin, direction);
    let intersections = raycaster.intersectObjects(objects, true);
    if (intersections && intersections.length > 0) {
      const firstIntersection = intersections[0];
      return firstIntersection.distance;
    } else {
      return Number.POSITIVE_INFINITY;
    }
  }

  private getUpStepPosition(camera: Camera): Vector3 {
    return new Vector3(
      camera.position.x,
      camera.position.y - this.eyeHeight + this.wiggleRoom,
      camera.position.z
    );
  }

  private getClearanceDown(camera: Camera, objects: Object3D[]): number {
    return this.getDistance(camera.position, objects, new Vector3(0, -1, 0));
  }

  private getClearanceForward(camera: Camera, objects: Object3D[]): number {
    const dir = new Vector3();
    camera.getWorldDirection(dir);
    dir.setY(0).normalize();
    return this.getDistance(this.getUpStepPosition(camera), objects, dir);
  }

  private getClearanceBackward(camera: Camera, objects: Object3D[]): number {
    const dir = new Vector3();
    camera.getWorldDirection(dir);
    dir.setY(0).normalize();
    return this.getDistance(
      this.getUpStepPosition(camera),
      objects,
      dir.negate()
    );
  }

  private getClearanceLeft(camera: Camera, objects: Object3D[]): number {
    const dir = new Vector3(-1, 0, 0);
    dir.applyMatrix4(camera.matrix);
    dir.setY(0);
    dir.normalize();
    return this.getDistance(this.getUpStepPosition(camera), objects, dir);
  }

  private getClearanceRight(camera: Camera, objects: Object3D[]): number {
    const dir = new Vector3(1, 0, 0);
    dir.applyMatrix4(camera.matrix);
    dir.setY(0);
    dir.normalize();
    return this.getDistance(this.getUpStepPosition(camera), objects, dir);
  }

  private getClearances(
    camera: Camera,
    objects: Object3D[],
    wiggleRoom: number
  ): {
    forward: number;
    backward: number;
    left: number;
    right: number;
    down: number;
  } {
    return {
      forward: Math.max(
        0,
        this.getClearanceForward(camera, objects) - wiggleRoom
      ),
      backward: Math.max(
        0,
        this.getClearanceBackward(camera, objects) - wiggleRoom
      ),
      left: Math.max(0, this.getClearanceLeft(camera, objects) - wiggleRoom),
      right: Math.max(0, this.getClearanceRight(camera, objects) - wiggleRoom),
      down: this.getClearanceDown(camera, objects),
    };
  }

  private getEffectiveForwardRightMovements(
    camera: Camera,
    objects: Object3D[],
    proposedFwd: number,
    proposedRight: number,
    wiggleRoom: number
  ): { forward: number; right: number } {
    const clearances = this.getClearances(camera, objects, wiggleRoom);
    return {
      forward:
        proposedFwd > 0
          ? Math.min(proposedFwd, clearances.forward)
          : Math.max(proposedFwd, -clearances.backward),
      right:
        proposedRight > 0
          ? Math.min(proposedRight, clearances.right)
          : Math.max(proposedRight, -clearances.left),
    };
  }

  moveFirstPerson(
    flags: {
      forward: boolean;
      backward: boolean;
      left: boolean;
      right: boolean;
    },
    time: number,
    obstacles: Object3D[]
  ): void {
    const speed = this.speed;
    const proposedFwdMovement = flags.forward
      ? speed * time * 100
      : flags.backward
      ? -speed * time * 100
      : 0;
    const proposedRightMovement = flags.right
      ? speed * time * 100
      : flags.left
      ? -speed * time * 100
      : 0;
    const controls = this.controls;
    const effFwdRight = this.getEffectiveForwardRightMovements(
      controls.getObject(),
      obstacles,
      proposedFwdMovement,
      proposedRightMovement,
      this.wiggleRoom
    );
    controls.moveForward(effFwdRight.forward);
    controls.moveRight(effFwdRight.right);
    const camera = controls.getObject();
    const oldY = camera.position.y;
    const laterDistance = this.getClearanceDown(camera, obstacles);
    if (laterDistance > 0 && laterDistance < Number.POSITIVE_INFINITY) {
      camera.position.y = oldY + this.eyeHeight - laterDistance;
    }
  }
}
