import _ from '../../../canvas/utils';

export const animationDogTail = (time, item) => {
  const progress = Math.floor(time % 6);
  let amp;

  if (progress < 2) {
    amp = 0.8;
  }

  if (progress >= 2 && progress < 3) {
    amp = 0.4;
  }

  if (progress >= 3 && progress < 5) {
    amp = 0.8;
  }

  if (progress === 5) {
    amp = 0.4;
  }

  item.rotation.x = amp * Math.sin((3 * Math.PI * time));
};

export const animationSaturn = (time, item) => {
  const positionAmp = 35;
  const positionPeriod = 3;

  const rotateAmp = 1.2;
  const rotatePeriod = 8;

  item.position.x = 320 - (positionAmp * Math.sin((Math.PI * time) / positionPeriod));
  item.rotation.y = rotateAmp * Math.sin((Math.PI * time) / rotatePeriod);
};

export const animationLeaf = (time, item, amp, speed) => {
  item.rotation.x = amp * Math.sin((Math.PI * _.easeOutElastic(time * speed))) * 10;
};

export const animationCompass = (time, amp, item) => {
  item.rotation.z = amp * Math.sin((Math.PI * time) / 2);
};

export const animationSonya = (time, sonya, rightHand, leftHand) => {
  const positionY = 10 * Math.sin((2 * Math.PI * time) / 2);
  const rotationX1 = -0.05 * Math.sin((2 * Math.PI * time) / 2);

  sonya.position.y = positionY;
  rightHand.rotation.y = -1.3 + rotationX1;
  leftHand.rotation.y = 1.3 - rotationX1;
};
