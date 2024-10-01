import * as THREE from 'three';
import {getLatheDegrees} from "../utils/lathe-options";
import isMobile from "../utils/detect-mobile";

class Floor extends THREE.Group {
  constructor(material) {
    super();

    this.material = material;

    this.startDeg = 0;
    this.finishDeg = 90;
    this.isShadow = !isMobile;

    this.constructChildren();
  }

  constructChildren() {
    this.addBase(this.material);
  }

  addBase(material) {
    const {start, length} = getLatheDegrees(this.startDeg, this.finishDeg);
    const base = new THREE.CircleGeometry(1350, 10, start, length);
    const baseMesh = new THREE.Mesh(base, material);

    baseMesh.rotation.copy(new THREE.Euler(90 * THREE.Math.DEG2RAD, 0, 0));
    baseMesh.receiveShadow = this.isShadow;

    this.add(baseMesh);
  }
}

export default Floor;
