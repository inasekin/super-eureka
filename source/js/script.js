// modules
import mobileHeight from './modules/mobile-height-adjust.js';
import slider from './modules/slider.js';
import menu from './modules/menu.js';
import footer from './modules/footer.js';
import chat from './modules/chat.js';
import result from './modules/result.js';
import form from './modules/form.js';
import social from './modules/social.js';
import FullPageScroll from './modules/full-page-scroll';
import base from './modules/base';
import AccentTypographyBuild from './modules/text-animation';
import IntroAndStory from "./modules/three-js/intro-and-story";

// init modules
mobileHeight();
slider();
menu();
footer();
chat();
result();
form();
social();
base();

const introAndStory = new IntroAndStory(`canvas-intro-story`);

introAndStory.init();

const fullPageScroll = new FullPageScroll();
fullPageScroll.init();

const animationIntroTitle = new AccentTypographyBuild(`.intro__title`, 500, `active-animation`, `transform`, false, 0);
const animationContestDate = new AccentTypographyBuild(`.intro__date`, 500, `active-animation`, `transform`, true, 700);
const animationHistoryTitle = new AccentTypographyBuild(`.slider__item-title`, 500, `active-animation`, `transform`, true, 0);
const animationPrizesTitle = new AccentTypographyBuild(`.prizes__title`, 500, `active-animation`, `transform`, true, 0);

export {introAndStory};
