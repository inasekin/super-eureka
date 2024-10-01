import * as THREE from "three";
import SvgLoader from "../svg-loader/svg-loader";
import Rug from "./objects/rug";
import Saturn from "./objects/saturn";
import {setMaterial} from "../story";
import {loadModel} from "../3D/model-loader";
import {colors} from "./helpers/colors";
import {reflectivity} from "./helpers/reflectivity";
import Floor from "./objects/floor";
import isMobile from "./utils/detect-mobile";
import {animationDogTail, animationSaturn} from "./helpers/animate-other-objects";

export default class Scene1Slide extends THREE.Group {
  constructor() {
    super();

    this.constructChildren();
    this.isShadow = !isMobile;
    this.startTime = -1;

    this.isLoadedDog = false;
    this.animationStart = false;

    this.loop = this.loop.bind(this);
  }

  constructChildren() {
    this.addFlowers();
    this.addRug();
    this.addSaturn();
    this.getWall();
    this.getFloor();
    this.addSceneStatic();
    this.getDog();
    this.toggleAnimations();
  }

  addFlowers() {
    const flower = new SvgLoader(`flower`).createSvgGroup();
    const scale = 1;

    flower.position.set(60, 420, 440);
    flower.scale.set(scale, -scale, scale);
    flower.rotation.copy(new THREE.Euler(0, 90 * THREE.Math.DEG2RAD, 0 * THREE.Math.DEG2RAD), `XYZ`);

    this.add(flower);
  }

  addRug() {
    const rug = new Rug(`Slide1`);

    this.add(rug);
  }

  addSaturn() {
    const saturn = new Saturn(`slide1`);

    saturn.position.set(320, 500, 200);

    this.saturn = saturn;

    this.add(saturn);
  }

  getWall() {
    const name = `wallCornerUnit`;
    const material = setMaterial({color: colors.Purple, ...reflectivity.soft, side: THREE.DoubleSide});

    loadModel(name, material, (mesh) => {
      mesh.name = name;

      this.add(mesh);
    });
  }

  getFloor() {
    const material = setMaterial({color: colors.DarkPurple, ...reflectivity.soft, side: THREE.DoubleSide});
    const mesh = new Floor(material);

    this.add(mesh);
  }

  addSceneStatic() {
    const name = `scene1`;

    loadModel(name, null, (mesh) => {
      mesh.name = name;

      this.add(mesh);
    });
  }

  getDog() {
    const name = `dog`;

    loadModel(name, null, (mesh) => {
      mesh.name = name;
      mesh.position.set(500, 0, 430);
      mesh.rotation.copy(new THREE.Euler(0, 60 * THREE.Math.DEG2RAD, 0));

      this.dog = mesh;
      this.isLoadedDog = true;

      this.add(mesh);
    });
  }

  loop() {
    this.animations();

    if (this.animationStart) {
      requestAnimationFrame(this.loop);
    } else {
      cancelAnimationFrame(this.loop);
    }
  }

  animations() {
    if (this.startTime < 0) {
      this.startTime = Date.now();

      return;
    }

    if (!this.isLoadedDog) {
      return;
    }

    const nowTime = Date.now();
    const time = (nowTime - this.startTime) * 0.001;

    animationDogTail(time, this.dog.getObjectByName(`Tail`));
    animationSaturn(time, this.saturn);
  }

  toggleAnimations() {
    document.body.addEventListener(`activeAnimationSlide1`, () => {
      this.animationStart = true;
      this.loop();
    });

    document.body.addEventListener(`activeAnimationSlide2`, () => {
      this.animationStart = false;
    });
  }
}
