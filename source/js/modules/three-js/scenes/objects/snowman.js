import * as THREE from "three";
import {colors} from "../helpers/colors";
import {reflectivity} from "../helpers/reflectivity";
import isMobile from "../utils/detect-mobile";

export default class Snowman extends THREE.Group {
  constructor(material) {
    super();

    this.colorBall = colors.SnowColor;
    this.colorCone = colors.Orange;
    this.material = material;
    this.isShadow = !isMobile;

    this.constructChildren();
  }

  constructChildren() {
    this.addSmallBoll();
    this.addBigBoll();
    this.addCone();
  }

  addSmallBoll() {
    const boll = new THREE.SphereGeometry(44, 30, 30);
    const mesh = new THREE.Mesh(boll, this.material({color: this.colorBall, ...reflectivity.strong}));

    this.smallBoll = mesh;
    this.smallBoll.castShadow = this.isShadow;

    this.add(mesh);
  }

  addBigBoll() {
    const boll = new THREE.SphereGeometry(75, 30, 30);
    const mesh = new THREE.Mesh(boll, this.material({color: this.colorBall, ...reflectivity.strong}));

    mesh.position.set(0, -108, 0);
    mesh.castShadow = this.isShadow;

    this.add(mesh);
  }

  addCone() {
    const cone = new THREE.ConeBufferGeometry(Math.hypot(18, 18) / 2, 75, 30);
    const mesh = new THREE.Mesh(cone, this.material({color: this.colorCone, ...reflectivity.soft}));

    const leftOffset = this.smallBoll.geometry.parameters.radius + 32 - cone.parameters.height / 2;
    const topOffset = this.smallBoll.position.y;

    mesh.position.set(leftOffset, topOffset, 0);
    mesh.rotation.copy(new THREE.Euler(0, 0, -90 * THREE.Math.DEG2RAD, `XYZ`));
    mesh.castShadow = this.isShadow;

    this.add(mesh);
  }
}
