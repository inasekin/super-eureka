import _ from '../../../canvas/utils';

const animateConfig = {
  durationMove: 0.5,
  startY: -450,
  finishY: -655,
  initialScale: 1,
  minScale: 0.85,
  maxScale: 1.15
};

const tick = (from, to, progress) => from + progress * (to - from);

export default class AnimationSuitcase {
  constructor(object) {

    this.object = object;
    this.suitcase = this.object.children[0];
    this.animationMoveStop = false;
    this.animationScaleStop = false;
    this.startTime = -1;
    this.startTimeScale = -1;

    this.loop = this.loop.bind(this);
    this.init();
  }

  init() {
    this.loop();
  }

  loop() {
    this.update();

    if (this.animationMoveStop && this.animationScaleStop) {
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

    setTimeout(() => {
      this.updatePositionY(time);

      setTimeout(() => {
        this.updateScale(time);
      }, 100);
    }, 300);
  }

  updatePositionY(time) {
    let progress = time / animateConfig.durationMove;
    const easing = _.easeInCubic(progress);

    if (progress > 1) {
      this.animationMoveStop = true;

      return;
    }

    this.suitcase.position.y = tick(animateConfig.startY, animateConfig.finishY, easing);
  }

  updateScale(time) {
    let progress = time / 0.8;
    const easing = _.easeLinear(progress);

    let scaleX = animateConfig.initialScale;
    let scaleY = animateConfig.initialScale;
    let scaleZ = animateConfig.initialScale;

    if (progress > 1) {
      this.startTimeScale = -1;
      this.animationScaleStop = true;

      return;
    }

    if (progress < 0.5) {
      scaleX = tick(animateConfig.initialScale, animateConfig.minScale, easing);
      scaleY = tick(animateConfig.initialScale, animateConfig.maxScale, easing);
      scaleZ = tick(animateConfig.initialScale, animateConfig.minScale, easing);
    }

    if (progress > 0.5 && progress < 0.8) {
      scaleX = tick(animateConfig.minScale, animateConfig.maxScale, easing);
      scaleY = tick(animateConfig.maxScale, animateConfig.minScale, easing);
      scaleZ = tick(animateConfig.minScale, animateConfig.maxScale, easing);
    }

    if (progress > 0.8 && progress <= 1) {
      scaleX = tick(animateConfig.maxScale, animateConfig.initialScale, easing);
      scaleY = tick(animateConfig.minScale, animateConfig.initialScale, easing);
      scaleZ = tick(animateConfig.maxScale, animateConfig.initialScale, easing);
    }

    this.suitcase.scale.set(scaleX, scaleY, scaleZ);
  }
}
