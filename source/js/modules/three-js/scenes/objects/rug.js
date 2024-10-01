import * as THREE from 'three';
import {getLathePoints, getLatheDegrees} from '../utils/lathe-options';
import rugShaderMaterial from "../../materials/rug-shader-material";
import {colors} from "../helpers/colors";

export default class Rug extends THREE.Group {
  constructor(slideName) {
    super();

    this.colorBase = slideName === `Slide1` ? colors.LightPurple : colors.ShadowedLightPurple;
    this.colorStrips = slideName === `Slide1` ? colors.AdditionalPurple : colors.ShadowedAdditionalPurple;
    this.startDeg = 16;
    this.finishDeg = 74;
    this.lengthStrip = (this.finishDeg - this.startDeg) / 7;

    this.constructChildren();
  }

  constructChildren() {
    this.addBase();
  }

  addBase() {
    const points = getLathePoints(180, 3, 763);
    const {start, length} = getLatheDegrees(this.startDeg, this.finishDeg);

    const base = new THREE.LatheBufferGeometry(points, 50, start, length);
    const material = new THREE.ShaderMaterial(rugShaderMaterial({
      baseColor: {value: new THREE.Color(this.colorBase)},
      stripeColor: {value: new THREE.Color(this.colorStrips)}
    }));

    const baseMesh = new THREE.Mesh(base, material);

    this.add(baseMesh);
  }
}
