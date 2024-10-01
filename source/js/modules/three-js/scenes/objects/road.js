import * as THREE from 'three';
import {getLathePoints, getLatheDegrees} from '../utils/lathe-options';
import roadShaderMaterial from "../../materials/road-shader-material";
import {colors} from "../helpers/colors";

export default class Road extends THREE.Group {
  constructor() {
    super();

    this.colorBase = colors.Grey;
    this.colorStrips = colors.White;
    this.startDeg = 0;
    this.finishDeg = 90;
    this.lengthStrip = (this.finishDeg - this.startDeg) / 12;

    this.constructChildren();
  }

  constructChildren() {
    this.addBase();
  }

  addBase() {
    const points = getLathePoints(160, 3, 732);
    const {start, length} = getLatheDegrees(this.startDeg, this.finishDeg);

    const base = new THREE.LatheBufferGeometry(points, 50, start, length);
    const material = new THREE.ShaderMaterial(roadShaderMaterial({
      baseColor: {value: new THREE.Color(this.colorBase)},
      stripeColor: {value: new THREE.Color(this.colorStrips)}
    }));

    const baseMesh = new THREE.Mesh(base, material);

    this.add(baseMesh);
  }
}
