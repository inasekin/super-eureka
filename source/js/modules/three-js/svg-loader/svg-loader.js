import * as THREE from 'three';
import {SVGLoader} from "three/examples/jsm/loaders/SVGLoader";
import svgConfig from "./svg-config";
import isMobile from "../scenes/utils/detect-mobile";

export default class SvgLoader {
  constructor(
      name
  ) {
    this.name = name;
  }

  createSvgGroup() {
    const loader = new SVGLoader();
    const group = new THREE.Group();
    const self = this;

    loader.load(
        svgConfig[this.name].src,
        function (data) {
          const paths = data.paths;

          for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(svgConfig[self.name].color),
              ...svgConfig[self.name].reflectivity
            });

            const shapes = path.toShapes(false);

            for (let j = 0; j < shapes.length; j++) {
              const shape = shapes[j];
              const geometry = new THREE.ExtrudeBufferGeometry(shape, {
                depth: svgConfig[self.name].depth,
                bevelThickness: svgConfig[self.name].cap
              });
              const mesh = new THREE.Mesh(geometry, material);

              if (!isMobile) {
                mesh.castShadow = svgConfig[self.name].castShadow;
              }

              group.add(mesh);
            }
          }
        }
    );

    return group;
  }
}
