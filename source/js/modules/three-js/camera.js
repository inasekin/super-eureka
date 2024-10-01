import * as THREE from "three";
import _ from "../canvas/utils";

const tick = (from, to, progress) => from + progress * (to - from);

export default class CameraRig extends THREE.Group {
  constructor(camera, introScene, storyScene) {
    super();

    this.camera = camera;
    this.introScene = introScene;
    this.storyScene = storyScene;

    this.startTime = -1;
    this.startCamera = false;
    this.startCameraInStory = false;
    this.durationAnimateion = 1;
    this.angle = 90;
    this.rotate = 0;

    this._positionTruckChanged = false;
    this._rotationTruckChanged = false;

    this.positionStartTruckZ = 0;
    this.positionFinishTruckZ = 0;

    this.rotationStartTruckZ = 0;
    this.rotationFinishtTruckZ = -0.335;

    this.initCameraPostionIntro = 1405;
    this._positionTruck = 1405;

    this.isIntroScreen = true;

    this.finishPositionCamera = [136, 0, 0];
    this.finishRorationCamera = 0;

    this.constructRigElements();
  }

  constructRigElements() {
    let cameraGroup = new THREE.Group();
    let cameraGroupMouseRotationRig = new THREE.Group();

    this.add(cameraGroup);
    cameraGroup.add(cameraGroupMouseRotationRig);
    cameraGroupMouseRotationRig.add(this.camera);
    this.cameraGroup = cameraGroup;
    this.cameraGroupMouseRotationRig = cameraGroupMouseRotationRig;
  }

  get rotationTruck() {
    return this._rotationTruck;
  }

  set rotationTruck(value) {
    if (this._rotationTruck === value) {
      return;
    }

    this._rotationTruck = value;
    this._rotationTruckChanged = true;
  }

  get positionTruck() {
    return this._positionTruck;
  }

  set positionTruck(value) {
    if (this._positionTruck === value) {
      return;
    }

    this._positionTruck = value;
    this._positionTruckChanged = true;
  }

  get rotationTruckInStory() {
    return this._rotationTruckInStory;
  }

  set rotationTruckInStory(value) {
    if (this._rotationTruckInStory === value) {
      return;
    }

    this._rotationTruckInStory = value;
    this._rotationTruckInStoryChanged = true;
  }

  get positionTruckInStory() {
    return this._positionTruckInStory;
  }

  set positionTruckInStory(value) {
    if (this._positionTruckInStory === value) {
      return;
    }

    this._positionTruckInStory = value;
    this._positionTruckInStoryChanged = true;
  }

  setCameraIntro() {
    this.camera.position.z = this.initCameraPostionIntro;
    this.camera.rotation.x = 0;
    this.cameraGroup.rotation.y = 0;
    this.cameraGroup.position.set(0, 0, 0);
    this.camera.lookAt(this.introScene.position.x, this.introScene.position.y, this.introScene.position.z);
    this.isIntroScreen = true;
  }

  setCameraFromIntroToStory() {
    this.startCamera = true;
    this.camera.lookAt(this.storyScene.position.x, this.storyScene.position.y, this.storyScene.position.z);
    this.positionStartTruckZ = this.camera.position.z;
    this.positionFinishTruckZ = this.isLandscape ? -680 : -780;
    this.durationAnimateion = 0.5;
    this.isIntroScreen = false;
  }

  toStoryWithoutAnimation() {
    this.camera.rotation.x = this.rotationFinishtTruckZ;
    this.camera.position.z = this.isLandscape ? -680 : -780;
    this.cameraGroup.position.set(...this.finishPositionCamera);
    this.cameraGroup.rotation.y = this.finishRorationCamera;
    this.camera.lookAt(this.storyScene.position.x, this.storyScene.position.y, this.storyScene.position.z);
    this.isIntroScreen = false;
  }

  setCameraStory(finishAngle, finishRotate) {
    this.startCameraInStory = true;
    this.finishAngle = finishAngle;
    this.finishRotate = finishRotate;
    this.durationAnimateion = 0.5;
    this.isIntroScreen = false;
  }

  setCameraRotation(ratio) {
    this.cameraGroupMouseRotationRig.position.y = ratio * 50;

    if (this.isIntroScreen) {
      this.camera.lookAt(this.introScene.position.x, this.introScene.position.y, this.introScene.position.z);
    } else {
      this.camera.lookAt(this.storyScene.position.x, this.storyScene.position.y, this.storyScene.position.z);
    }
  }

  setIsLandscape(isLandscape) {
    this.isLandscape = isLandscape;
  }

  update() {
    if (this.startCamera) {
      if (this.startTime < 0) {
        this.startTime = Date.now();

        return;
      }

      const nowTime = Date.now();
      const time = (nowTime - this.startTime) * 0.001;

      this.animateCamera(time);
    }

    if (this.startCameraInStory) {
      if (this.startTime < 0) {
        this.startTime = Date.now();

        return;
      }

      const nowTime = Date.now();
      const time = (nowTime - this.startTime) * 0.001;

      this.animateCameraInStory(time);
    }
  }

  animateCamera(time) {
    const progress = time / this.durationAnimateion;
    const easing = _.easeLinear(progress);

    if (progress > 1) {
      this.startCamera = false;
      this.startTime = -1;

      return;
    }

    if (progress > 0.5) {
      this.rotationTruck = tick(this.rotationStartTruckZ, this.rotationFinishtTruckZ, easing);
    }

    this.positionTruck = tick(this.positionStartTruckZ, this.positionFinishTruckZ, easing);

    this.invalidate();
  }

  animateCameraInStory(time) {
    const progress = time / this.durationAnimateion;
    const easing = _.easeLinear(progress);

    let angle = this.angle + easing * (this.finishAngle - this.angle);
    let rotate = this.rotate + easing * (this.finishRotate - this.rotate);

    const posX = 2550 * Math.cos(angle * THREE.Math.DEG2RAD);
    const posZ = 2550 * Math.sin(angle * THREE.Math.DEG2RAD);

    if (progress > 1) {
      this.angle = this.finishAngle;
      this.rotate = this.finishRotate;
      this.startCameraInStory = false;
      this.startTime = -1;

      this.finishPositionCamera = this.positionTruckInStory;
      this.finishRorationCamera = this.rotationTruckInStory;
      return;
    }

    this.positionTruckInStory = [this.storyScene.position.x + posX, 0, this.storyScene.position.z + posZ];
    this.rotationTruckInStory = rotate;

    this.invalidate();
  }

  invalidate() {
    if (this._positionTruckChanged) {
      this.camera.position.z = this.positionTruck;
      this._positionTruckChanged = false;
    }

    if (this._rotationTruckChanged) {
      this.camera.rotation.x = this.rotationTruck;
      this._rotationTruckChanged = false;
    }

    if (this._rotationTruckInStoryChanged) {
      this.cameraGroup.rotation.y = this.rotationTruckInStory;
      this._rotationTruckInStoryChanged = false;
    }

    if (this._positionTruckInStoryChanged) {
      this.cameraGroup.position.set(...this.positionTruckInStory);
      this._positionTruckInStoryChanged = false;
    }
  }

  addChild(item) {
    this.cameraGroup.add(item);
  }
}
