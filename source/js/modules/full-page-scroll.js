import throttle from 'lodash/throttle';
import CounterAnimation from './counter';
import CounterPrizesAnimation from './counter-prizes';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
    this.counterAnimation = null;
    this.counterCasesAnimation = null;
    this.counterCodesAnimation = null;
    this.introScene = null;
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      this.reCalculateActiveScreenPosition(evt.deltaY);
      const currentPosition = this.activeScreen;
      if (currentPosition !== this.activeScreen) {
        this.changePageDisplay();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    let isHistoryScreen = false;
    const hiddenClass = `screen--hidden`;
    const activeClass = `active`;
    const bgClass = `fill-bg`;

    this.screenElements.forEach((screen) => {
      if (screen.id === `top` && screen.classList.contains(activeClass)) {
        this.introScene = true;
      }

      if (screen.id === `story` && screen.classList.contains(activeClass)) {
        isHistoryScreen = true;
        screen.classList.remove(activeClass);
        screen.classList.add(bgClass);

        setTimeout(() => {
          screen.classList.add(hiddenClass);
          screen.classList.remove(bgClass);
        }, 450);
      } else {
        screen.classList.add(hiddenClass);
        screen.classList.remove(activeClass);
      }
    });

    if (isHistoryScreen) {
      setTimeout(() => {
        this.setActiveScreen();
      }, 450);
    } else {
      this.setActiveScreen();
    }
  }

  setActiveScreen() {
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(`active`);
    }, 100);

    // generate random path for  prizes svg. For start img animation after open prize screen
    if (this.screenElements[this.activeScreen][`id`] === `prizes`) {
      document.querySelectorAll(`.prizes__list img`).forEach((element) => {
        element.src = `${element.src}?${Math.floor(Math.random() * 1000000000)}`;
      });

      this.counterCasesAnimation = new CounterPrizesAnimation(document.querySelector(`.prizes__item--cases .prizes__desc > b`), 1, 7, 6800);
      this.counterCasesAnimation.startCounter();

      this.counterCodesAnimation = new CounterPrizesAnimation(document.querySelector(`.prizes__item--codes .prizes__desc > b`), 11, 900, 7800);
      this.counterCodesAnimation.startCounter();
    }

    if (this.screenElements[this.activeScreen][`id`] === `story`) {
      const event = new Event(`activeStory`);

      document.body.dispatchEvent(event);

      if (this.introScene) {
        const eventa = new Event(`activeStoryFromIntro`);

        document.body.dispatchEvent(eventa);

        this.introScene = false;
      }
    }

    if (this.screenElements[this.activeScreen][`id`] === `top`) {
      const event = new Event(`activeIntro`);

      document.body.dispatchEvent(event);
    }

    if (!(this.screenElements[this.activeScreen][`id`] === `top`) && !(this.screenElements[this.activeScreen][`id`] === `story`)) {
      const event = new Event(`notActiveIntroAndStory`);

      document.body.dispatchEvent(event);
    }

    this.initCounter(this.screenElements[this.activeScreen][`id`]);
  }

  initCounter(activeScreen) {
    if (activeScreen === `game` && this.counterAnimation === null) {
      this.counterAnimation = new CounterAnimation(document.querySelectorAll(`.game__counter span`));
      this.counterAnimation.startCounter();
    }

    if (activeScreen === `game` && this.counterAnimation !== null) {
      this.counterAnimation.stopCounter();
      this.counterAnimation = new CounterAnimation(document.querySelectorAll(`.game__counter span`));
      this.counterAnimation.startCounter();
    }

    if (activeScreen !== `game` && this.counterAnimation) {
      this.counterAnimation.stopCounter();
      this.counterAnimation = null;
    }
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
