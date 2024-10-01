import * as THREE from "three";
import {setMaterial} from "../story";
import Pyramid from "./objects/pyramid";
import Flashlight from "./objects/flashlight";
import SvgLoader from "../svg-loader/svg-loader";
import {loadModel} from "../3D/model-loader";
import {colors} from "./helpers/colors";
import {reflectivity} from "./helpers/reflectivity";
import Floor from "./objects/floor";
import {animationLeaf} from "./helpers/animate-other-objects";

export default class Scene2Slide extends THREE.Group {
  constructor() {
    super();

    this.animationStart = false;
    this.startTime = -1;

    this.loop = this.loop.bind(this);

    this.constructChildren();
  }

  constructChildren() {
    this.addPyramid();
    this.addFlashlight();
    this.addLeaf1();
    this.addLeaf2();
    this.getWall();
    this.getFloor();
    this.addSceneStatic();
    this.toggleAnimations();
  }

  addPyramid() {
    let pyramid = new Pyramid(setMaterial);

    pyramid.scale.set(1, 1.2, 1);
    pyramid.rotation.copy(new THREE.Euler(0, 45 * THREE.Math.DEG2RAD, 0, `XYZ`));
    pyramid.position.set(230, 170, 260);

    this.add(pyramid);
  }

  addFlashlight() {
    let flashlight = new Flashlight(setMaterial);

    flashlight.scale.set(0.76, 0.76, 0.76);
    flashlight.rotation.copy(new THREE.Euler(0, 20 * THREE.Math.DEG2RAD, 0, `XYZ`));
    flashlight.position.set(650, 50, 120);

    this.add(flashlight);
  }

  addLeaf1() {
    const leafGroup = new THREE.Group();
    let leaf = new SvgLoader(`leafPyramid`).createSvgGroup();
    const scale = 1.6;

    leaf.position.set(-60, -120, 0);

    leafGroup.add(leaf);
    leafGroup.position.set(80, 0, 350);
    leafGroup.scale.set(scale, -scale, scale);
    leafGroup.rotation.copy(new THREE.Euler(0, 90 * THREE.Math.DEG2RAD, -10 * THREE.Math.DEG2RAD), `XYZ`);

    this.leaf1 = leafGroup;
    this.add(leafGroup);
  }

  addLeaf2() {
    const leafGroup = new THREE.Group();
    let leaf = new SvgLoader(`leafPyramid`).createSvgGroup();
    const scale = 1.4;

    leaf.position.set(-60, -120, 0);

    leafGroup.add(leaf);
    leafGroup.position.set(75, 0, 420);
    leafGroup.scale.set(scale, -scale, scale);
    leafGroup.rotation.copy(new THREE.Euler(0, 90 * THREE.Math.DEG2RAD, 35 * THREE.Math.DEG2RAD), `XYZ`);

    this.leaf2 = leafGroup;
    this.add(leafGroup);
  }

  getWall() {
    const name = `wallCornerUnit`;
    const material = setMaterial({color: colors.Blue, ...reflectivity.basic, side: THREE.DoubleSide});

    loadModel(name, material, (mesh) => {
      mesh.name = name;

      this.add(mesh);
    });
  }

  getFloor() {
    const material = setMaterial({color: colors.BrightBlue, ...reflectivity.soft, side: THREE.DoubleSide});
    const mesh = new Floor(material);

    this.add(mesh);
  }

  addSceneStatic() {
    const name = `scene2`;

    loadModel(name, null, (mesh) => {
      mesh.name = name;

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

    const nowTime = Date.now();
    const time = (nowTime - this.startTime) * 0.001;

    animationLeaf(time, this.leaf1, 0.03, 0.075);
    animationLeaf(time, this.leaf2, 0.015, 0.05);
  }

  toggleAnimations() {
    document.body.addEventListener(`activeAnimationSlide2`, () => {
      this.animationStart = true;
      this.loop();
    });

    document.body.addEventListener(`activeAnimationSlide1`, () => {
      this.animationStart = false;
      this.startTime = -1;
    });
  }
}
