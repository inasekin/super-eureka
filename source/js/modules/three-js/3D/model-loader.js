import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import modelsConfig from "./models-config";
import isMobile from "../scenes/utils/detect-mobile";


const loadObj = (path, onComplete) => {
  const loaderObj = new OBJLoader();

  loaderObj.load(path, onComplete);
};

const loadGltf = (path, onComplete) => {
  const loaderGltf = new GLTFLoader();

  loaderGltf.load(path, onComplete);
};

const onComplete = (obj3d, material, params, callback) => {
  if (material) {
    obj3d.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
  }

  if (!isMobile) {
    obj3d.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = params.castShadow;
        child.receiveShadow = params.receiveShadow;
      }
    });
  }

  if (typeof callback === `function`) {
    callback.call(null, obj3d);
  }
};

export const loadModel = (key, material, callback) => {
  const params = modelsConfig[key];

  if (!params) {
    return;
  }

  const onGltfComplete = (gltf) => {
    if (!gltf.scene) {
      return;
    }

    onComplete(gltf.scene, material, params, callback);
  };

  switch (params.type) {
    case `gltf`:
      loadGltf(params.path, onGltfComplete);

      break;
    default:
      loadObj(params.path, (model) => onComplete(model, material, params, callback));

      break;
  }
};
