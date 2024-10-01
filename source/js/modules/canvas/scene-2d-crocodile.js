import Animation from './animation.js';
import Scene2D from "./scene-2d";
import _ from "./utils";

const IMAGES_URLS = Object.freeze({
  crocodile: `./img/lose-images/crocodile.png`,
  key: `./img/module-4/lose-images/key.png`,
  flamingo: `./img/lose-images/flamingo.png`,
  watermelon: `./img/lose-images/watermelon.png`,
  leaf: `./img/lose-images/leaf.png`,
  snowflake: `./img/lose-images/snowflake.png`,
  saturn: `./img/lose-images/saturn.png`,
  drop: `./img/lose-images/drop.png`
});

const OBJECTS = Object.freeze({
  key: {
    imageId: `key`,
    x: 50,
    y: 55,
    size: 0,
    opacity: 0,
    transforms: {
    }
  },
  crocodile: {
    imageId: `crocodile`,
    x: 49,
    y: 60,
    size: 65,
    opacity: 0,
    transforms: {
      translateX: 30,
      translateY: -15,
    }
  },
  flamingo: {
    imageId: `flamingo`,
    x: 32,
    y: 50,
    size: 0,
    opacity: 0,
    transforms: {
      translateX: 16,
      translateY: 5,
      rotate: 20
    }
  },
  watermelon: {
    imageId: `watermelon`,
    x: 20,
    y: 65,
    size: 0,
    opacity: 0,
    transforms: {
      translateX: 25,
      translateY: -8,
      rotate: 20
    }
  },
  leaf: {
    imageId: `leaf`,
    x: 76,
    y: 46,
    size: 0,
    opacity: 0,
    transforms: {
      translateX: -26,
      translateY: 10,
      rotate: -20
    }
  },
  snowflake: {
    imageId: `snowflake`,
    x: 65,
    y: 55,
    size: 0,
    opacity: 0,
    transforms: {
      translateX: -15,
      translateY: 0,
      rotate: -20
    }
  },
  saturn: {
    imageId: `saturn`,
    x: 75,
    y: 65,
    size: 0,
    opacity: 0,
    transforms: {
      translateX: -25,
      translateY: -10,
      rotate: 20
    }
  },
  drop: {
    imageId: `drop`,
    x: 47,
    y: 60.5,
    size: 0,
    opacity: 0,
    transforms: {}
  }
});

export default class ResultFail extends Scene2D {
  constructor() {
    const canvas = document.getElementById(`crocodile-scene`);

    super({
      canvas,
      objects: OBJECTS,
      imagesUrls: IMAGES_URLS
    });

    this.animationsDrop = [];
  }

  beginAnimation() {
    this.afterInit = () => {
      this.objects.flamingo.before = this.drawMask.bind(this);
    };

    this.initEventListeners();
    this.initObjects(OBJECTS);
    this.start();
    this.updateSize();
  }

  initAnimations() {
    this.animations.push(new Animation({
      func: () => {
        this.drawScene();
      },
      duration: `infinite`,
      fps: 60
    }));

    this.keyAnimations();
    this.crocodileAnimations();
    this.flamingoAnimations();
    this.watermelonAnimations();
    this.leafAnimations();
    this.snowflakeAnimations();
    this.saturnAnimations();

    setTimeout(() => {
      this.animDrop();
    }, 1500);
  }

  drawMask() {
    const mask = {
      centerX: this.objects.key.x,
      centerY: this.objects.key.y,
      opacity: 1,
    };

    let width = this.objects.key.widthImg;
    let height = this.objects.key.heightImg;


    if (mask.opacity === 0) {
      return;
    }

    const s = this.size / 100;

    this.ctx.save();
    this.ctx.globalAlpha = mask.opacity;
    this.ctx.fillStyle = `#acc3ff`;

    this.ctx.beginPath();

    this.ctx.arc((mask.centerX + width * 0.0008) * s, (mask.centerY - height * 0.0214) * s, width * 0.48, 0, 180);
    this.ctx.moveTo((mask.centerX + width * 0.028) * s, (mask.centerY - height * 0.01) * s);
    this.ctx.lineTo((mask.centerX + width * 0.058) * s, (mask.centerY + height * 0.08) * s);
    this.ctx.lineTo((mask.centerX - width * 0.25) * s, (mask.centerY + height * 0.08) * s);
    this.ctx.lineTo((mask.centerX - width * 0.25) * s, (mask.centerY - height * 0.0495) * s);
    this.ctx.lineTo((mask.centerX) * s, (mask.centerY - height * 0.0495) * s);
    this.ctx.globalCompositeOperation = `destination-in`;
    this.ctx.fill();
    this.ctx.restore();
  }

  keyAnimations() {
    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.key.opacity = progress;
        this.objects.key.size = 15 * progress;
      },
      duration: 400
    }));
  }

  crocodileAnimations() {
    this.animations.push(new Animation({
      func: (progress) => {
        const progressReversed = 1 - progress;

        this.objects.crocodile.transforms.translateX = 30 * progressReversed;
        this.objects.crocodile.transforms.translateY = -15 * progressReversed;

      },
      delay: 950,
      duration: 500,
    }));

    this.animations.push(new Animation({
      func: () => {
        this.objects.crocodile.opacity = 1;
      }
    }));
  }

  flamingoAnimations() {
    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.flamingo.opacity = progress;
      },
      duration: 100
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        const progressReversed = 1 - progress;

        this.objects.flamingo.size = 13 * progress;
        this.objects.flamingo.transforms.translateX = 16 * progressReversed;
        this.objects.flamingo.transforms.translateY = 5 * progressReversed;
        this.objects.flamingo.transforms.rotate = 20 * progressReversed;

      },
      easing: _.easeOutCubic,
      delay: 100,
      duration: 800
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.flamingo.transforms.translateY = 40 * progress;
      },
      easing: _.easeInCubic,
      delay: 900,
      duration: 600
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.flamingo.opacity = 1 - progress;
      },
      delay: 1400,
      duration: 100
    }));
  }

  watermelonAnimations() {
    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.watermelon.opacity = progress;
      },
      duration: 100
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        const progressReversed = 1 - progress;

        this.objects.watermelon.size = 11 * progress;
        this.objects.watermelon.transforms.translateX = 25 * progressReversed;
        this.objects.watermelon.transforms.translateY = -8 * progressReversed;
        this.objects.watermelon.transforms.rotate = 20 * progressReversed;

      },
      easing: _.easeOutCubic,
      delay: 100,
      duration: 800
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.watermelon.transforms.translateY = 40 * progress;
      },
      easing: _.easeInCubic,
      delay: 900,
      duration: 600
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.watermelon.opacity = 1 - progress;
      },
      delay: 1400,
      duration: 100
    }));
  }

  leafAnimations() {
    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.leaf.opacity = progress;
      },
      duration: 100
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        const progressReversed = 1 - progress;

        this.objects.leaf.size = 15 * progress;
        this.objects.leaf.transforms.translateX = -26 * progressReversed;
        this.objects.leaf.transforms.translateY = 10 * progressReversed;
        this.objects.leaf.transforms.rotate = -20 * progressReversed;

      },
      easing: _.easeOutCubic,
      delay: 100,
      duration: 800
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.leaf.transforms.translateY = 40 * progress;
      },
      easing: _.easeInCubic,
      delay: 900,
      duration: 400
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.leaf.opacity = 1 - progress;
      },
      delay: 1200,
      duration: 100
    }));

  }

  snowflakeAnimations() {
    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.snowflake.opacity = progress;
      },
      duration: 100
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        const progressReversed = 1 - progress;

        this.objects.snowflake.size = 11 * progress;
        this.objects.snowflake.transforms.translateX = -15 * progressReversed;
        this.objects.snowflake.transforms.translateY = 0 * progressReversed;
        this.objects.snowflake.transforms.rotate = -20 * progressReversed;

      },
      easing: _.easeOutCubic,
      delay: 100,
      duration: 800
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.snowflake.transforms.translateY = 40 * progress;
      },
      easing: _.easeInCubic,
      delay: 900,
      duration: 600
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.snowflake.opacity = 1 - progress;
      },
      delay: 1400,
      duration: 100
    }));
  }

  saturnAnimations() {
    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.saturn.opacity = progress;
      },
      duration: 100
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        const progressReversed = 1 - progress;

        this.objects.saturn.size = 15 * progress;
        this.objects.saturn.transforms.translateX = -25 * progressReversed;
        this.objects.saturn.transforms.translateY = -10 * progressReversed;
        this.objects.saturn.transforms.rotate = 20 * progressReversed;

      },
      easing: _.easeOutCubic,
      delay: 100,
      duration: 800
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.saturn.transforms.translateY = 40 * progress;
      },
      easing: _.easeInCubic,
      delay: 900,
      duration: 600
    }));

    this.animations.push(new Animation({
      func: (progress) => {
        this.objects.saturn.opacity = 1 - progress;
      },
      delay: 1400,
      duration: 100
    }));
  }

  animDrop() {
    this.animationsDrop.push(new Animation({
      func: (progress) => {
        this.objects.drop.size = 3.8 * progress;
        this.objects.drop.opacity = progress;
      },
      duration: 700,
    }));

    this.animationsDrop.push(new Animation({
      func: (progress) => {
        this.objects.drop.transforms.translateY = 8 * progress;
      },
      delay: 700,
      duration: 500,
    }));

    this.animationsDrop.push(new Animation({
      func: (progress) => {
        const progressReversed = 1 - progress;

        this.objects.drop.size = 3.8 * progressReversed;
        this.objects.drop.opacity = progressReversed;
      },
      delay: 1100,
      duration: 200,
    }));

    this.animationsDrop.push(new Animation({
      func: () => {
        this.objects.drop.transforms.translateY = 0;
      },
      delay: 1200,
      duration: 100
    }));

    this.animationsDrop.forEach((animation) => {
      animation.start();
    });

    setTimeout(() => {
      this.animDrop();
    }, 2500);
  }
}
