import Swiper from "swiper";
import {introAndStory} from "../script";

export default () => {
  let storySlider;

  const setSlider = function () {
    const body = document.body;

    if (((window.innerWidth / window.innerHeight) < 1) || window.innerWidth < 769) {
      storySlider = new Swiper(`.js-slider`, {
        pagination: {
          el: `.swiper-pagination`,
          type: `bullets`
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: () => {
            if (storySlider.activeIndex === 0 || storySlider.activeIndex === 1) {
              introAndStory.setStory(0);
            } else if (storySlider.activeIndex === 2 || storySlider.activeIndex === 3) {
              introAndStory.setStory(1);
            } else if (storySlider.activeIndex === 4 || storySlider.activeIndex === 5) {
              introAndStory.setStory(2);
            } else if (storySlider.activeIndex === 6 || storySlider.activeIndex === 7) {
              introAndStory.setStory(3);
            }
          },
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    } else {
      storySlider = new Swiper(`.js-slider`, {
        slidesPerView: 2,
        slidesPerGroup: 2,
        allowTouchMove: false,
        pagination: {
          el: `.swiper-pagination`,
          type: `fraction`
        },
        navigation: {
          nextEl: `.js-control-next`,
          prevEl: `.js-control-prev`,
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: () => {
            if (storySlider.activeIndex === 0) {
              body.classList.remove(`second`, `third`, `fourth`);
              body.classList.add(`first`);
              introAndStory.setStory(0);
            } else if (storySlider.activeIndex === 2) {
              body.classList.remove(`first`, `third`, `fourth`);
              body.classList.add(`second`);
              introAndStory.setStory(1);
            } else if (storySlider.activeIndex === 4) {
              body.classList.remove(`first`, `second`, `fourth`);
              body.classList.add(`third`);
              introAndStory.setStory(2);
            } else if (storySlider.activeIndex === 6) {
              body.classList.add(`fourth`);
              body.classList.remove(`first`, `third`, `second`);
              introAndStory.setStory(3);
            }
          },
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    }
  };

  window.addEventListener(`resize`, function () {
    if (storySlider) {
      storySlider.destroy();
    }
    setSlider();
  });

  setSlider();
};
