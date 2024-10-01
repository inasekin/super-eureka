// файл не нужен сейчас и нигде не используется, сохранен чтобы потом полезный код перенести

import * as THREE from "three";
import {storyRowShaderMaterial} from "./materials/simple-raw-shader-material";
import AllStories from "./scenes/story-scenes-all";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import Stats from "three/examples/jsm/libs/stats.module";
import {loadModel} from "./3D/model-loader";
import isMobile from "./scenes/utils/detect-mobile";
import AnimationSuitcase from "./scenes/helpers/animate-suicase";

// добавление инструмента для измерения FPS
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

let animationHueSettings = {
  initialHue: 0,
  finalHue: -0.4,
  currentHue: 0,
  duration: 1,
  timeStart: -1
};

export const setMaterial = (options = {}) => {
  const {color, ...other} = options;

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    ...other
  });
};

export default class Story {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.render = this.render.bind(this);
    this.isAnimation = true;

    this.center = {x: this.width / 2, y: this.height / 2};
    this.isActiveTwoScreen = false;
    this.isNeedToRepeatCycleHue = true;
    this.firstLoaded = true;

    this.textures = [
      {src: `./img/module-5/scenes-textures/scene-1.png`, options: {hue: 0.0}},
      {src: `./img/module-5/scenes-textures/scene-2.png`, options: {hue: 0.0, isMagnifier: true}},
      {src: `./img/module-5/scenes-textures/scene-3.png`, options: {hue: 0.0}},
      {src: `./img/module-5/scenes-textures/scene-4.png`, options: {hue: 0.0}}
    ];

    this.bubbleGlareOffset = 0.8;
    this.bubbleGlareStartRadianAngle = 2;
    this.bubbleGlareEndRadianAngle = 3;
    this.bubblesDuration = 4;

    this.bubbles = [
      {
        radius: 80.0,
        initialPosition: [this.center.x - 100, 0],
        position: [],
        finalPosition: [this.center.x - 100, this.center.y + this.height],
        amplitude: 80,
        glareOffset: this.bubbleGlareOffset,
        glareAngleStart: this.bubbleGlareStartRadianAngle,
        glareAngleEnd: this.bubbleGlareEndRadianAngle,
        timeStart: -1
      },
      {
        radius: 40.0,
        initialPosition: [this.center.x + 100, this.center.y - this.height * 1.4],
        position: [],
        finalPosition: [this.center.x + 100, this.center.y + this.height],
        amplitude: 60,
        glareOffset: this.bubbleGlareOffset,
        glareAngleStart: this.bubbleGlareStartRadianAngle,
        glareAngleEnd: this.bubbleGlareEndRadianAngle,
        timeStart: -1
      },
      {
        radius: 60.0,
        initialPosition: [this.center.x - 350, this.center.y - this.height * 2],
        position: [],
        finalPosition: [this.center.x - 350, this.center.y + this.height],
        amplitude: -100,
        glareOffset: this.bubbleGlareOffset,
        glareAngleStart: this.bubbleGlareStartRadianAngle,
        glareAngleEnd: this.bubbleGlareEndRadianAngle,
        timeStart: -1
      },
    ];
  }

  init() {
    this.canvas = document.getElementById(this.canvasId);
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.color = new THREE.Color(0x5f458c);
    this.alpha = 1;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: false,
      logarithmicDepthBuffer: false,
      powerPreference: `high-performance`
    });

    this.renderer.setClearColor(this.color, this.alpha);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);

    if (!isMobile) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    this.camera = new THREE.PerspectiveCamera(35, this.aspectRation, 0.1, 20000);
    this.camera.position.z = 2550;

    this.controls = new OrbitControls(this.camera, document.getElementById(`story`));

    const lights = this.getLight();
    this.lights = lights;
    this.lights.position.z = this.camera.position.z;

    this.scene.add(lights);

    this.addSceneAllStory();
    this.getSuitcase();
  }

  addSceneAllStory() {
    const sceneAllStory = new AllStories();

    sceneAllStory.position.set(0, 0, -3000);
    sceneAllStory.rotation.copy(new THREE.Euler(0, -45 * THREE.Math.DEG2RAD, 0));

    this.SceneAllStory = sceneAllStory;
    this.scene.add(sceneAllStory);

    this.toggleRendering();
  }

  toggleRendering() {
    document.body.addEventListener(`activeStory`, () => {
      if (this.firstLoaded && this.suitcaseIsLoaded) {
        this.animateSuitcase();
      } else if (this.firstLoaded && !this.suitcaseIsLoaded) {
        const timerId = setInterval(() => {
          if (this.suitcaseIsLoaded) {
            this.animateSuitcase();
            clearInterval(timerId);
          }
        }, 100);
      }

      this.createEvent(`activeAnimationSlide1`);

      this.firstLoaded = false;
      this.isAnimation = true;
      this.setCamera(90, true);
    });

    document.body.addEventListener(`notActiveStory`, () => {
      this.isAnimation = false;
    });
  }

  getLight() {
    const light = new THREE.Group();

    let lightUnit = new THREE.DirectionalLight(new THREE.Color(`rgb(255,255,255)`), 0.6);
    lightUnit.position.set(200, 0, 3000);
    light.add(lightUnit);

    lightUnit = new THREE.PointLight(new THREE.Color(`rgb(246,242,255)`), 0.3);
    lightUnit.position.set(-500, 700, -700);

    if (!isMobile) {
      lightUnit.castShadow = true;
      lightUnit.shadow.camera.far = 3000;
      lightUnit.shadow.mapSize.width = 1000;
      lightUnit.shadow.mapSize.height = 1000;
    }

    light.add(lightUnit);

    lightUnit = new THREE.PointLight(new THREE.Color(`rgb(245,254,255)`), 0.3);
    lightUnit.position.set(500, 1500, -700);

    if (!isMobile) {
      lightUnit.castShadow = true;
      lightUnit.shadow.camera.far = 3000;
      lightUnit.shadow.mapSize.width = 1000;
      lightUnit.shadow.mapSize.height = 1000;
    }

    light.add(lightUnit);

    return light;
  }

  addBubble(index) {
    const width = this.renderer.getSize().width;
    const pixelRatio = this.renderer.getPixelRatio();

    if (this.textures[index].options.isMagnifier) {
      return {
        magnification: {
          value: {
            bubbles: this.bubbles,
            resolution: [width * pixelRatio, width / this.textureRatio * pixelRatio],
          }
        },
      };
    }

    return {};
  }

  createMaterial(texture, index) {
    return new THREE.RawShaderMaterial(storyRowShaderMaterial({
      map: {value: texture.src},
      options: {value: texture.options},
      ...this.addBubble(index)
    }));
  }

  setScene(sceneID) {
    let angle = 0;
    this.isAnimation = false;

    if (sceneID === 0) {
      angle = 90;
      this.createEvent(`activeAnimationSlide1`);
    } else if (sceneID === 1) {
      angle = 0;
      this.createEvent(`activeAnimationSlide2`);
    } else if (sceneID === 2) {
      angle = -90;
      this.createEvent(`activeAnimationSlide3`);
    } else if (sceneID === 3) {
      angle = 180;
      this.createEvent(`activeAnimationSlide4`);
    }

    // запускем функцию, где определяется что второй слайд и запускаются эффекты для второго слайда
    this.actionSlideTwo(sceneID);

    this.setCamera(angle, false);
  }

  setCamera(angle, isFirsLoad) {
    const posX = 2150 * Math.cos(angle * THREE.Math.DEG2RAD);
    const posZ = 2150 * Math.sin(angle * THREE.Math.DEG2RAD);

    this.camera.position.set(this.SceneAllStory.position.x + posX, 800, this.SceneAllStory.position.z + posZ);
    this.controls.target.set(this.SceneAllStory.position.x, this.SceneAllStory.position.y, this.SceneAllStory.position.z);

    this.setPositionLight(isFirsLoad, angle);

    setTimeout(() => {
      this.isAnimation = true;
      this.render();
    }, 100);
  }

  setPositionLight(isFirsLoad, angle) {
    this.lights.position.x = this.camera.position.x;
    this.lights.position.z = this.camera.position.z;

    let angleObj;
    let positionX;
    let positionZ;

    switch (angle) {
      case 90:
        angleObj = 0;
        positionX = 0;
        positionZ = 0;
        break;
      case 0:
        angleObj = 90;
        positionX = 3050;
        positionZ = -3050;
        break;
      case -90:
        angleObj = 180;
        positionX = -60;
        positionZ = -5980;
        break;
      case 180:
        angleObj = -90;
        positionX = -3000;
        positionZ = -3000;
        break;
    }

    if (!isFirsLoad) {
      this.suitcase.rotation.copy(new THREE.Euler(0, angleObj * THREE.Math.DEG2RAD, 0));
      this.suitcase.position.set(positionX, 0, positionZ);
    }
  }

  actionSlideTwo(sceneID) {
    this.resetHueCycle();
    this.resetBubbleCycle();

    if (sceneID === 1) {
      this.isActiveTwoScreen = true;
      this.startAnimate();
    } else {
      this.isActiveTwoScreen = false;
      this.isNeedToRepeatCycleHue = true;
      this.resetHueShift();
      animationHueSettings.currentHue = 0;
    }
  }

  // обнуляем параметры для запуска нового цикла мигания
  resetHueCycle() {
    animationHueSettings.duration = this.getRandomNumber(1.5, 2); // рандомная длительность одного мигания
    animationHueSettings.timeStart = Date.now() * 0.001; // обнуляем время отсчета
  }

  resetBubbleCycle() {
    this.bubbles.forEach((bubble) => {
      bubble.timeStart = Date.now() * 0.001;
    });
  }

  // обнуляем hue
  resetHueShift() {
    this.textures[1].options.hue = animationHueSettings.initialHue;
  }

  startAnimate() {
    this.animateHueShift();

    // запуск анимации для всех пузырьков
    this.bubbles.forEach((bubble) => {
      this.animateBubbles(bubble);
    });

    // обнуляем цикл мигания для последующего запуска снова
    if (this.isNeedToRepeatCycleHue) {
      this.isNeedToRepeatCycleHue = false;
      animationHueSettings.currentHue = 0;

      this.resetHueCycle();
    }

    // если активен второй слайдер, то гоняем действует requestAnimationFrame, если нет - отменяет его
    if (this.isActiveTwoScreen) {
      requestAnimationFrame(() => {
        this.startAnimate();
      });
    } else {
      cancelAnimationFrame(() => {
        this.startAnimate();
      });
    }
  }

  animateHueShift() {
    let hueValue = animationHueSettings.currentHue;

    if (animationHueSettings.timeStart > 0) {
      const t = Date.now() * 0.001 - animationHueSettings.timeStart;

      // время превышено для данного цикла анимации
      if (t >= animationHueSettings.duration) {
        animationHueSettings.timeStart = -1;
        this.isNeedToRepeatCycleHue = true;
      }

      const progress = t / animationHueSettings.duration;

      if (progress < 0.5) {
        hueValue = (animationHueSettings.initialHue + progress * (animationHueSettings.finalHue - animationHueSettings.initialHue)) * 2;
      } else if (progress > 0.5) {
        hueValue = (animationHueSettings.finalHue + progress * (animationHueSettings.initialHue - animationHueSettings.finalHue)) * 2;
      }
    }

    // обновляем значение hue для последующей передачи в шейдер
    if (hueValue !== animationHueSettings.currentHue) {
      this.textures[1].options.hue = hueValue;
      animationHueSettings.currentHue = hueValue;
    }
  }

  animateBubbles(bubble) {
    if (bubble.timeStart > 0) {
      const t = Date.now() * 0.001 - bubble.timeStart;
      const progress = t / this.bubblesDuration;

      const y = bubble.initialPosition[1] + progress * (bubble.finalPosition[1] - bubble.initialPosition[1]);
      const offset = bubble.amplitude * Math.pow(1 - progress, 1) * Math.sin(progress * Math.PI * 10);
      const x = (offset + bubble.initialPosition[0]);

      bubble.position = [x, y];
    }
  }

  getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  getSuitcase() {
    const suitcaseGroup = new THREE.Group();
    const name = `suitcase`;

    loadModel(name, null, (mesh) => {
      mesh.name = name;
      mesh.position.set(-400, 100, -2230);
      mesh.rotation.copy(new THREE.Euler(0, -25 * THREE.Math.DEG2RAD, 0));

      suitcaseGroup.add(mesh);

      this.suitcaseIsLoaded = true;
    });

    this.suitcase = suitcaseGroup;
    this.scene.add(suitcaseGroup);
  }

  animateSuitcase() {
    const animationSuitcase = new AnimationSuitcase(this.suitcase);
  }

  createEvent(name) {
    const event = new Event(name);

    document.body.dispatchEvent(event);
  }

  render() {
    stats.begin();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    stats.end();

    if (this.isAnimation) {
      requestAnimationFrame(this.render);
    } else {
      cancelAnimationFrame(this.render);
    }
  }
}
