// файл не нужен сейчас и нигде не используется, сохранен чтобы потом полезный код перенести

import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import IntroScene from "./scenes/intro-scene";
import {animateIntroObjects, AnimationSuitcaseIntro} from "./scenes/helpers/animate-intro-objects";
import {meshObjects} from "./scenes/intro-scene";
import {AnimationAirplane} from "./scenes/helpers/animation-plane";

export default class Intro {
  constructor() {
    this.textures = [{src: `./img/module-5/scenes-textures/scene-0.png`, options: {hue: 0.0}}];
    this.render = this.render.bind(this);
    this.firstLoaded = true;
    this.isAnimation = true;
  }

  setMaterial(options = {}) {
    const {color, ...other} = options;

    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      ...other
    });
  }

  init() {
    // если не первый раз переходим на главную, то чтобы занаво не грузились и не инициализировались опять все images
    if (!this.firstLoaded) {
      return;
    }

    this.firstLoaded = false;

    const self = this;

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

    this.camera = new THREE.PerspectiveCamera(45, this.aspectRation, 0.1, 20000);
    this.camera.position.z = 1405;

    this.controls = new OrbitControls(this.camera, document.getElementById(`top`));


    const loadManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadManager);
    const loadedTextures = this.textures.map((texture) =>
      ({src: textureLoader.load(texture.src), options: texture.options})
    );

    loadManager.onLoad = () => {
      loadedTextures.forEach((texture, index) => {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = self.createMaterial(texture, index);
        const mesh = new THREE.Mesh(geometry, material);

        mesh.scale.x = this.textureWidth;
        mesh.scale.y = this.textureHeight;
        mesh.position.x = this.textureWidth * index;

        this.scene.add(new IntroScene());

        const lights = this.setLights();
        lights.position.z = this.camera.position.z;
        this.scene.add(lights);

        // this.scene.add(mesh);
        this.render();
        this.startAnimations();
      });
    };

    this.render();

    this.toggleRendering();
  }

  toggleRendering() {
    document.body.addEventListener(`activeIntro`, () => {
      this.isAnimation = true;
      this.render();
    });

    document.body.addEventListener(`notActiveIntro`, () => {
      this.isAnimation = false;
    });
  }

  setLights() {
    const light = new THREE.Group();

    let lightUnit = new THREE.DirectionalLight(new THREE.Color(`rgb(255,255,255)`), 0.60);

    lightUnit.position.set(0, this.camera.position.z * Math.tan(-15 * THREE.Math.DEG2RAD), this.camera.position.z);
    light.add(lightUnit);

    lightUnit = new THREE.PointLight(new THREE.Color(`rgb(246,242,255)`), 0.30, 3000, 0.5);
    lightUnit.position.set(-730, -350, 0);
    light.add(lightUnit);

    lightUnit = new THREE.PointLight(new THREE.Color(`rgb(245,254,255)`), 0.3, 3000, 0.5);
    lightUnit.position.set(730, 400, 0);
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
        const animationAirplane = new AnimationAirplane(this.airplane);
      }
    }, 100);
  }

  render() {
    if (this.isAnimation) {
      requestAnimationFrame(this.render);
    } else {
      cancelAnimationFrame(this.render);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
