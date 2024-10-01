import * as THREE from 'three';
import {setMaterial} from "../../story";
import {getLathePoints} from '../utils/lathe-options';
import {colors} from "../helpers/colors";
import {reflectivity} from "../helpers/reflectivity";
import isMobile from "../utils/detect-mobile";

export default class Saturn extends THREE.Group {
  constructor(slide) {
    super();

    this.colorSaturn = slide === `slide1` ? colors.DominantRed : colors.ShadowedDominantRed;
    this.colorRing = slide === `slide1` ? colors.BrightPurple : colors.ShadowedBrightPurple;
    this.colorRope = colors.MetalGrey;
    this.isShadow = !isMobile;

    this.constructChildren();
  }

  constructChildren() {
    this.addSphereBig();
    this.addRing();
    this.addRope();
    this.addSphereSmall();
  }

  addSphereBig() {
    const sphere = new THREE.SphereGeometry(60, 50, 50);

    this.sphereBigMesh = new THREE.Mesh(sphere, setMaterial({color: this.colorSaturn, flatShading: true, ...reflectivity.soft}));
    this.sphereBigMesh.castShadow = this.isShadow;

    this.add(this.sphereBigMesh);
  }

  addRing() {
    const points = getLathePoints(40, 2, 80);
    const ring = new THREE.LatheBufferGeometry(points, 50);
    const ringMesh = new THREE.Mesh(ring, setMaterial({color: this.colorRing, flatShading: true, side: THREE.DoubleSide, ...reflectivity.soft}));

    ringMesh.rotation.copy(new THREE.Euler(20 * THREE.Math.DEG2RAD, 0, 18 * THREE.Math.DEG2RAD), `XYZ`);
    ringMesh.castShadow = this.isShadow;
    ringMesh.name = `ring;`;

    this.add(ringMesh);
  }

  addRope() {
    const cylinder = new THREE.CylinderBufferGeometry(1, 1, 1000, 10);
    const topOffset = this.sphereBigMesh.position.y + cylinder.parameters.height / 2;

    this.cylinderMesh = new THREE.Mesh(cylinder, setMaterial({color: this.colorRope, flatShading: true, ...reflectivity.soft}));
    this.cylinderMesh.position.set(0, topOffset, 0);
    this.cylinderMesh.castShadow = this.isShadow;

    this.add(this.cylinderMesh);
  }

  addSphereSmall() {
    const sphere = new THREE.SphereGeometry(10, 30, 30);
    const topOffset = this.sphereBigMesh.position.y + this.sphereBigMesh.geometry.parameters.radius * 2;
    const sphereSmallMesh = new THREE.Mesh(sphere, setMaterial({color: this.colorRing, flatShading: true, ...reflectivity.soft}));

    sphereSmallMesh.position.set(this.cylinderMesh.position.x, topOffset, this.cylinderMesh.position.z);
    sphereSmallMesh.castShadow = this.isShadow;

    this.add(sphereSmallMesh);
  }
}
