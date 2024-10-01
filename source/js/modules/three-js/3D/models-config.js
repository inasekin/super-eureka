import {colors} from "../scenes/helpers/colors";
import {reflectivity} from "../scenes/helpers/reflectivity";

const modelsConfig = {
  airplane: {
    type: `obj`,
    path: `./3d/module-6/scene-0-objects/airplane.obj`,
    color: colors.White,
    reflectivity: reflectivity.soft,
    castShadow: false,
  },
  suitcase: {
    type: `gltf`,
    path: `./3d/module-6/scene-0-objects/suitcase.gltf`,
    castShadow: true,
  },
  watermelon: {
    type: `gltf`,
    path: `./3d/module-6/scene-0-objects/watermelon.gltf`,
  },
  wallCornerUnit: {
    type: `obj`,
    path: `3d/module-6/rooms-scenes/common/WallCornerUnit.obj`,
    receiveShadow: true,
  },
  scene1: {
    type: `gltf`,
    path: `3d/module-6/rooms-scenes/scenesStatic/scene1-static-output-1.gltf`,
    castShadow: true,
    receiveShadow: true
  },
  scene2: {
    type: `gltf`,
    path: `3d/module-6/rooms-scenes/scenesStatic/scene2-static-output-1.gltf`,
    castShadow: true,
    receiveShadow: true
  },
  scene3: {
    type: `gltf`,
    path: `3d/module-6/rooms-scenes/scenesStatic/scene3-static-output-1.gltf`,
    castShadow: true,
    receiveShadow: true
  },
  scene4: {
    type: `gltf`,
    path: `3d/module-6/rooms-scenes/scenesStatic/scene4-static-output-1.gltf`,
    castShadow: true,
    receiveShadow: true
  },
  dog: {
    type: `gltf`,
    path: `3d/module-6/rooms-scenes/objects/dog.gltf`,
    castShadow: true,
  },
  compass: {
    type: `gltf`,
    path: `3d/module-6/rooms-scenes/objects/compass.gltf`,
    castShadow: true,
  },
  sonya: {
    type: `gltf`,
    path: `3d/module-6/rooms-scenes/objects/sonya.gltf`,
    castShadow: true,
  }
};

export default modelsConfig;
