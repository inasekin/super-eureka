import animationConfig from "./animation-config";
import * as THREE from "three";
import _ from '../../../canvas/utils';


const detectLess1024 = () => {
  return window.innerWidth < 1024;
};

const tick = (from, to, progress) => from + progress * (to - from);

export const animateIntroObjects = (animateObjects) => {
  // для каждого объекта создается класс, отвечающий за анимацию
  animateObjects.forEach((object) => {
    const animateObject = new AnimateIntroObjects(object);
  });
};

const addFluctuation = (item, config) => {
  let progress = 0;
  let startTime = Date.now();

  function loop() {
    progress = (Date.now() - startTime) * 0.0001;
    item.position.y = item.position.y + config.amp * Math.sin((2 * Math.PI * progress) / config.period);

    requestAnimationFrame(loop);
  }

  loop();

};

class AnimateIntroObjects extends THREE.Group {
  constructor(object) {
    super();
    this.object = object;

    this.startTime = -1;

    this.animationStop = false;

    this.loop = this.loop.bind(this);

    this.init();
  }

  init() {
    // записываем интро сцену как парент анимируемого объекта
    this.introScene = this.object.parent;

    const fluctuationGroup = new THREE.Group();
    const motionGroup = new THREE.Group();

    motionGroup.name = `motionGroup`;
    fluctuationGroup.name = `fluctuationGroup`;

    this.objectfluctuation = fluctuationGroup;
    this.objectMotion = motionGroup;

    // вкладываем объект в группы, чтобы для каждой группы можно было задать один тип анимации. А не все в кучу.
    motionGroup.add(this.object);
    fluctuationGroup.add(motionGroup);

    // созданную верхнюю группу делаем чайлдом всей интро сцены
    this.introScene.children.push(fluctuationGroup);

    // определяем конфиг для анимации
    this.config = animationConfig[this.object.name];

    setTimeout(() => {
      this.loop();
    }, this.config.delay);
  }

  loop() {
    this.update();

    if (this.animationStop) {
      cancelAnimationFrame(this.loop);
    } else {
      requestAnimationFrame(this.loop);
    }
  }

  update() {
    if (this.startTime < 0) {
      this.startTime = Date.now();

      return;
    }

    const nowTime = Date.now();
    const time = (nowTime - this.startTime) * 0.001;

    this.updateObjectParameters(time);
  }

  updateObjectParameters(time) {
    let progress = time / this.config.duration;
    const easing = _.easeOutCubic(progress);
    const finishPositionX = detectLess1024() ? this.config.finishPositionLandscape[0] : this.config.finishPosition[0];
    const finishPositionY = detectLess1024() ? this.config.finishPositionLandscape[1] : this.config.finishPosition[1];
    const finishPositionZ = detectLess1024() ? this.config.finishPositionLandscape[2] : this.config.finishPosition[2];

    if (progress > 1) {
      addFluctuation(this.objectfluctuation, this.config);
      this.animationStop = true;

      return;
    }

    const positionX = tick(this.config.startPosition[0], finishPositionX, easing);
    const positionY = tick(this.config.startPosition[1], finishPositionY, easing);
    const positionZ = tick(this.config.startPosition[2], finishPositionZ, easing);

    const scaleX = tick(this.config.startScale[0], this.config.finishScale[0], easing);
    const scaleY = tick(this.config.startScale[1], this.config.finishScale[1], easing);
    const scaleZ = tick(this.config.startScale[2], this.config.finishScale[2], easing);

    const rotationX = tick(this.config.startRotation[0], this.config.finishRotation[0], easing);
    const rotationY = tick(this.config.startRotation[1], this.config.finishRotation[1], easing);
    const rotationZ = tick(this.config.startRotation[2], this.config.finishRotation[2], easing);

    this.object.scale.set(scaleX, scaleY, scaleZ);
    this.objectMotion.position.set(positionX, positionY, positionZ);
    this.object.rotation.set(rotationX, rotationY, rotationZ);
  }
}

const animationSuitcaseConfig = {
  startScale: [0, 0, 0],
  finishScale: [0.6, 0.6, 0.6],
  startPosition: [0, 0, 100],
  finishPosition: [-70, -150, 400],
  startRotation: [-100, 0, 0],
  finishRotation: [20, -50, -10],
  amp: -0.33,
  period: 0.25
};

export class AnimationSuitcaseIntro extends THREE.Group {
  constructor(object) {
    super();
    this.object = object;

    this.startTime = -1;
    this.animationStop = false;

    this.loop = this.loop.bind(this);

    this.init();
  }

  init() {
    setTimeout(() => {
      this.loop();
    }, 600);
  }

  loop() {
    this.update();

    if (this.animationStop) {
      cancelAnimationFrame(this.loop);
    } else {
      requestAnimationFrame(this.loop);
    }
  }

  update() {
    if (this.startTime < 0) {
      this.startTime = Date.now();

      return;
    }

    const nowTime = Date.now();
    const time = (nowTime - this.startTime) * 0.001;

    this.animationShowSuitcase(time);
  }

  animationShowSuitcase(time) {
    let progress = time / 2;
    const easing = _.easeOutCubic(progress);

    if (progress > 1) {
      addFluctuation(this.object, animationSuitcaseConfig);
      this.animationStop = true;

      return;
    }

    const moveGroup = this.object.getObjectByName(`move`);
    const scaleGroup = this.object.getObjectByName(`scale`);
    const groupRotation = this.object.getObjectByName(`rotation`);
    const groupPositionXY = this.object.getObjectByName(`positionXY`);

    const scaleX = tick(animationSuitcaseConfig.startScale[0], animationSuitcaseConfig.finishScale[0], easing);
    const scaleY = tick(animationSuitcaseConfig.startScale[1], animationSuitcaseConfig.finishScale[1], easing);
    const scaleZ = tick(animationSuitcaseConfig.startScale[2], animationSuitcaseConfig.finishScale[2], easing);

    const positionX = tick(animationSuitcaseConfig.startPosition[0], animationSuitcaseConfig.finishPosition[0], easing);
    const positionY = tick(animationSuitcaseConfig.startPosition[1], animationSuitcaseConfig.finishPosition[1], easing);
    const positionZ = tick(animationSuitcaseConfig.startPosition[2], animationSuitcaseConfig.finishPosition[2], easing);

    const rotationX = tick(animationSuitcaseConfig.startRotation[0], animationSuitcaseConfig.finishRotation[0], easing);
    const rotationY = tick(animationSuitcaseConfig.startRotation[1], animationSuitcaseConfig.finishRotation[1], easing);
    const rotationZ = tick(animationSuitcaseConfig.startRotation[2], animationSuitcaseConfig.finishRotation[2], easing);

    const positionOnlyX = 30 * Math.sin((1.5 * Math.PI * easing) / 1.5);
    const positionOnlyY = 120 * Math.sin((1.5 * Math.PI * easing) / 1.5);

    scaleGroup.scale.set(scaleX, scaleY, scaleZ);
    moveGroup.position.set(positionX, positionY, positionZ);
    groupRotation.rotation.copy(new THREE.Euler(rotationX * THREE.Math.DEG2RAD, rotationY * THREE.Math.DEG2RAD, rotationZ * THREE.Math.DEG2RAD));
    groupPositionXY.position.set(positionOnlyX, positionOnlyY, 0);
  }
}

export const animOpacity = (item, finish, duration) => {
  let progress = 0;
  let startTime = Date.now();
  const start = item.material.opacity;

  item.material.transparent = true;

  function loop() {
    progress = (Date.now() - startTime) / duration;

    const opacity = start + progress * (finish - start);

    if (progress > 1) {
      return;
    }

    item.material.opacity = opacity;

    requestAnimationFrame(loop);
  }

  loop();
};

export const setPositionIntroObj = (items, isLandscape) => {
  let finishPosition;

  items.forEach((item) => {
    if (isLandscape) {
      finishPosition = animationConfig[item.name].finishPosition;
    } else {
      finishPosition = animationConfig[item.name].finishPositionLandscape;
    }

    item.parent.position.set(...finishPosition);
  });
};
