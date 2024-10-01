import Scene2DSeaCalf from './canvas/scene-2d-sea-calf';
import SceneFail from './canvas/scene-2d-crocodile';

export default () => {
  let showResultEls = document.querySelectorAll(`.js-show-result`);
  let results = document.querySelectorAll(`.screen--result`);
  if (results.length) {
    for (let i = 0; i < showResultEls.length; i++) {
      showResultEls[i].addEventListener(`click`, function () {
        let target = showResultEls[i].getAttribute(`data-target`);
        [].slice.call(results).forEach(function (el) {
          el.classList.remove(`screen--show`);
          el.classList.add(`screen--hidden`);
        });
        let targetEl = [].slice.call(results).filter(function (el) {
          return el.getAttribute(`id`) === target;
        });
        targetEl[0].classList.add(`screen--show`);
        targetEl[0].classList.remove(`screen--hidden`);
        initAnimationSlogan(targetEl[0]);

        if (targetEl[0].id === `result`) {
          const sceneCanvasAnimation = new Scene2DSeaCalf();

          sceneCanvasAnimation.beginAnimation();
        }

        if (targetEl[0].id === `result3`) {
          const sceneFailAnimation = new SceneFail();

          sceneFailAnimation.beginAnimation();
        }
      });
    }

    let playBtn = document.querySelector(`.js-play`);
    if (playBtn) {
      playBtn.addEventListener(`click`, function () {
        [].slice.call(results).forEach(function (el) {
          el.classList.remove(`screen--show`);
          el.classList.add(`screen--hidden`);
        });
        document.getElementById(`messages`).innerHTML = ``;
        document.getElementById(`message-field`).focus();
      });
    }
  }

  const createSvgAnimationEl = (tag, attrs) => {
    const el = document.createElementNS(`http://www.w3.org/2000/svg`, tag);

    attrs.forEach((attr) => {
      el.setAttribute(attr.name, attr.value);
    });

    return el;
  };

  const createAnimateStrokeDasharray = (letter, length, index, isFailAnimation) => {
    const animate = createSvgAnimationEl(`animate`, [
      {name: `attributeName`, value: `stroke-dasharray`},
      {name: `from`, value: `0, ${length}`},
      {name: `to`, value: `${length}, 0`},
      {name: `dur`, value: `500ms`},
      {name: `fill`, value: `freeze`}
    ]);

    letter.appendChild(animate);

    if (isFailAnimation) {
      setTimeout(() => {
        animate.beginElement();
      }, 80 * (index + 1));
    } else {
      animate.beginElement();
    }
  };

  const createAnimateOpacity = (letter, length, index) => {
    const animate = createSvgAnimationEl(`animate`, [
      {name: `attributeName`, value: `opacity`},
      {name: `from`, value: `0`},
      {name: `to`, value: `1`},
      {name: `dur`, value: `1ms`},
      {name: `fill`, value: `freeze`}
    ]);

    setTimeout(() => {
      letter.appendChild(animate);
      letter.classList.add(`start-translate`);
      animate.beginElement();
    }, 80 * (index + 1));
  };

  const initAnimationSlogan = (element) => {
    const isFailAnimation = element.getAttribute(`id`) === `result3`;

    const svgVictorySlogan = element.querySelector(`#game-slogan`);
    const letters = svgVictorySlogan.querySelectorAll(`path`);

    letters.forEach((letter, index) => {
      const pathLength = letter.getTotalLength();
      const length = pathLength / 3;
      letter.setAttribute(`stroke-dasharray`, `0, ${length}`);

      if (isFailAnimation) {
        setTimeout(() => {
          createAnimateStrokeDasharray(letter, length, index, isFailAnimation);
          createAnimateOpacity(letter, length, index);
        }, 500);
      } else {
        createAnimateStrokeDasharray(letter, length);
      }
    });
  };
};
