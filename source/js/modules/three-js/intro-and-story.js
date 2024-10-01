import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import IntroScene from "./scenes/intro-scene";
import {animateIntroObjects, AnimationSuitcaseIntro, setPositionIntroObj} from "./scenes/helpers/animate-intro-objects";
import {meshObjects} from "./scenes/intro-scene";
import {AnimationAirplane} from "./scenes/helpers/animation-plane";
import AllStories from "./scenes/story-scenes-all";
import CameraRig from "./camera";
import isMobile from "./scenes/utils/detect-mobile";
import {loadModel} from "./3D/model-loader";
import AnimationSuitcase from "./scenes/helpers/animate-suicase";
import {animOpacity} from "./scenes/helpers/animate-intro-objects";

import Stats from "three/examples/jsm/libs/stats.module";

// добавление инструмента для измерения FPS
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

export default class IntroAndStory {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.isAnimation = true;
    this.firstLoadedStoryFromIntro = true;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspectRation = this.width / this.height;

    this.textureWidth = 2048;
    this.textureHeight = 1024;
    this.textureRatio = this.textureWidth / this.textureHeight;

    this.render = this.render.bind(this);
    this.updateSize = this.updateSize.bind(this);
  }

  init() {
    window.addEventListener(`resize`, this.updateSize);

    this.canvas = document.getElementById(this.canvasId);
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.color = new THREE.Color(0x5f458c);
    this.alpha = 1;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    });

    this.renderer.setClearColor(this.color, this.alpha);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);

    this.isLandscape = window.innerHeight < window.innerWidth;

    if (!isMobile) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.camera = new THREE.PerspectiveCamera(45, this.aspectRation, 0.1, 20000);
    } else {
      this.camera = new THREE.PerspectiveCamera(60, this.aspectRation, 0.1, 20000);
    }


    // пока что отключил
    // this.controls = new OrbitControls(this.camera, document.getElementById(`top`));

    this.addScene();

    this.cameraRig = new CameraRig(this.camera, this.introGroupObj, this.SceneAllStory);
    this.cameraRig.setIsLandscape(this.isLandscape);

    this.scene.add(this.cameraRig);

    const lights = this.getLight();

    lights.position.z = 1405;

    this.cameraRig.addChild(lights);
    this.getSuitcase();

    this.addMotionByCursor();

    this.render();
    this.startAnimations();
    this.toggleRendering();
  }

  addScene() {
    this.addSceneIntro();
    this.addSceneStory();
  }

  addSceneIntro() {
    const introScene = new IntroScene();

    introScene.scale.set(1, 1, 1);
    introScene.position.set(0, 0, 0);
    this.introGroupObj = introScene;
    this.scene.add(introScene);
  }

  addSceneStory() {
    const sceneAllStory = new AllStories();

    sceneAllStory.position.set(0, -650, -2550);
    sceneAllStory.rotation.copy(new THREE.Euler(0, -45 * THREE.Math.DEG2RAD, 0));

    this.SceneAllStory = sceneAllStory;
    this.scene.add(sceneAllStory);
  }

  startHideBoardAnimation() {
    this.board = this.introGroupObj.getObjectByName(`boardMesh`);

    setTimeout(() => {
      animOpacity(this.board, 0, 500);
    }, 50);
  }

  showBoard() {
    this.board.material.opacity = 1;
  }

  toggleRendering() {
    document.body.addEventListener(`activeIntro`, () => {
      this.setStory(`intro`);

      if (!this.isAnimation) {
        this.isAnimation = true;

        setTimeout(() => {
          this.render();
        }, 10);
      }
    });

    document.body.addEventListener(`activeStory`, () => {
      if (!this.isAnimation) {
        this.isAnimation = true;

        setTimeout(() => {
          this.render();
        }, 10);
      }
    });

    document.body.addEventListener(`activeStoryFromIntro`, () => {
      this.setStory(`fromIntro`);
    });

    document.body.addEventListener(`notActiveIntroAndStory`, () => {
      this.isAnimation = false;
    });
  }

  addMotionByCursor() {
    document.addEventListener(`mousemove`, (e) => {
      let mouseY = e.pageY;
      let windowH = window.innerHeight;
      let ratio = 1 - (2 * mouseY / windowH);

      this.cameraRig.setCameraRotation(ratio);
    });
  }

  setStory(sceneID) {
    this.activeScene = sceneID;

    let angle = 0;

    switch (sceneID) {
      case `intro`:
        this.cameraRig.setCameraIntro();

        break;
      case `fromIntro`:
        if (this.firstLoadedStoryFromIntro) {
          this.startHideBoardAnimation();
          this.cameraRig.setCameraFromIntroToStory();
          this.animateSuitcase();
          this.createEvent(`activeAnimationSlide1`);
        } else {
          this.cameraRig.toStoryWithoutAnimation();
        }

        this.firstLoadedStoryFromIntro = false;

        setTimeout(() => {
          this.showBoard();
        }, 1000);

        break;
      case 0:
        angle = 90;
        this.cameraRig.setCameraStory(angle, 0);
        this.createEvent(`activeAnimationSlide1`);

        break;
      case 1:
        angle = 0;
        this.cameraRig.setCameraStory(angle, Math.PI / 2);
        this.createEvent(`activeAnimationSlide2`);

        break;
      case 2:
        angle = -90;
        this.cameraRig.setCameraStory(angle, Math.PI);
        this.createEvent(`activeAnimationSlide3`);

        break;
      case 3:
        angle = -180;
        this.cameraRig.setCameraStory(angle, Math.PI * 1.5);
        this.createEvent(`activeAnimationSlide4`);

        break;
    }

  }

  getLight() {
    const light = new THREE.Group();

    light.name = `light`;

    let lightUnit = new THREE.DirectionalLight(new THREE.Color(`rgb(255,255,255)`), 0.8);
    lightUnit.position.set(-0, 1405, 2000);
    light.add(lightUnit);

    lightUnit = new THREE.PointLight(new THREE.Color(`rgb(246,242,255)`), 0.3);
    lightUnit.position.set(-500, 500, -1800);

    if (!isMobile) {
      lightUnit.castShadow = true;
      lightUnit.shadow.camera.far = 3000;
      lightUnit.shadow.mapSize.width = 3000;
      lightUnit.shadow.mapSize.height = 3000;
    }

    light.add(lightUnit);

    lightUnit = new THREE.PointLight(new THREE.Color(`rgb(245,254,255)`), 0.3);
    lightUnit.position.set(900, 500, -1700);

    if (!isMobile) {
      lightUnit.castShadow = true;
      lightUnit.shadow.camera.far = 3000;
      lightUnit.shadow.mapSize.width = 3000;
      lightUnit.shadow.mapSize.height = 3000;
    }

    light.add(lightUnit);

    return light;
  }

  startAnimations() {
    let timerId = setInterval(() => {
      let stopTimer = false;

      this.flamingo = meshObjects.flamingo;
      this.leaf = meshObjects.leaf;
      this.question = meshObjects.question;
      this.snowflake = meshObjects.snowflake;
      this.watermelon = meshObjects.watermelon;

      this.objectsArray = [
        this.flamingo,
        this.leaf,
        this.question,
        this.snowflake,
        this.watermelon
      ];

      this.objectsArray.forEach((item) => {
        if (!item) {
          stopTimer = true;
        }
      });

      if (!stopTimer) {
        clearInterval(timerId);
        animateIntroObjects(this.objectsArray);
      }
    }, 100);

    let timerId2 = setInterval(() => {
      this.suitcase = meshObjects.suitcase;

      if (this.suitcase) {
        clearInterval(timerId2);
        const animationSuitcaseIntro = new AnimationSuitcaseIntro(this.suitcase);
      }
    }, 100);

    let timerId3 = setInterval(() => {
      this.airplane = meshObjects.airplane;

      if (this.airplane) {
        clearInterval(timerId3);
        this.animationAirplane = new AnimationAirplane(this.airplane);
      }
    }, 100);
  }

  getSuitcase() {
    const suitcaseGroup = new THREE.Group();
    const name = `suitcase`;

    loadModel(name, null, (mesh) => {
      mesh.name = name;
      mesh.position.set(-260, -450, -1700);
      mesh.rotation.copy(new THREE.Euler(0, -25 * THREE.Math.DEG2RAD, 0));

      suitcaseGroup.add(mesh);

      this.suitcaseIsLoaded = true;
    });

    this.suitcaseStory = suitcaseGroup;
    this.cameraRig.addChild(suitcaseGroup);
  }

  animateSuitcase() {
    this.animationSuitcase = new AnimationSuitcase(this.suitcaseStory);
  }

  createEvent(name) {
    const event = new Event(name);

    document.body.dispatchEvent(event);
  }

  updateSize() {
    const minFov = 45;
    const maxFov = 80;

    this.isLandscape = window.innerHeight < window.innerWidth;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.aspectRationPrev = this.aspectRation;
    this.aspectRation = this.width / this.height;

    this.cameraRig.setIsLandscape(this.isLandscape);

    if (!this.isLandscape) {
      if (this.aspectRationPrev > this.aspectRation) {
        this.camera.fov += this.aspectRation + 0.3;

        if (this.camera.fov >= maxFov) {
          this.camera.fov = maxFov;
        }
      } else {
        this.camera.fov -= this.aspectRation - 0.3;

        if (this.camera.fov <= minFov) {
          this.camera.fov = minFov;
        }
      }

      setPositionIntroObj(this.objectsArray, this.isLandscape);
      this.animationAirplane.setPositionIntroPlane(this.isLandscape);
    } else {
      this.camera.fov = 45;

      setPositionIntroObj(this.objectsArray, this.isLandscape);
      this.animationAirplane.setPositionIntroPlane(this.isLandscape);
    }

    this.camera.aspect = this.aspectRation;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  render() {
    if (this.isAnimation) {
      requestAnimationFrame(this.render);
    } else {
      cancelAnimationFrame(this.render);
    }

    this.cameraRig.update();

    stats.begin();
    this.renderer.render(this.scene, this.camera);
    stats.end();
  }
}
