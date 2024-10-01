import * as THREE from "three";
import Scene1Slide from "./slide-1";
import Scene2Slide from "./slide-2";
import Scene3Slide from "./slide-3";
import Scene4Slide from "./slide-4";

export default class AllStories extends THREE.Group {
  constructor() {
    super();

    this.constructChildren();
  }

  constructChildren() {
    this.addStory1();
    this.addStory2();
    this.addStory3();
    this.addStory4();
  }

  addStory1() {
    const storyScene1 = new Scene1Slide();

    storyScene1.position.set(0, 0, 0);
    this.storyScene1 = storyScene1;

    this.add(storyScene1);
  }

  addStory2() {
    const storyScene2 = new Scene2Slide();

    storyScene2.position.set(0, 0, 0);
    storyScene2.rotation.copy(new THREE.Euler(0, 90 * THREE.Math.DEG2RAD, 0));
    this.storyScene2 = storyScene2;

    this.add(storyScene2);
  }

  addStory3() {
    const storyScene3 = new Scene3Slide();

    storyScene3.position.set(0, 0, 0);
    storyScene3.rotation.copy(new THREE.Euler(0, 180 * THREE.Math.DEG2RAD, 0));
    this.storyScene2 = storyScene3;

    this.add(storyScene3);
  }

  addStory4() {
    const storyScene4 = new Scene4Slide();

    storyScene4.position.set(0, 0, 0);
    storyScene4.rotation.copy(new THREE.Euler(0, 270 * THREE.Math.DEG2RAD, 0));
    this.storyScene2 = storyScene4;

    this.add(storyScene4);
  }
}
