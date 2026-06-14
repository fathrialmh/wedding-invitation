import '../styles/base.css';
import '../styles/layout.css';
import '../styles/sections.css';
import '../styles/animations.css';

import { initConfigRenderer } from './config-renderer.js';
import { initUrlParams } from './url-params.js';
import { initCover } from './cover.js';
import { initAnimations } from './animations.js';
import { initAudio, playAudio, toggleAudio } from './audio.js';
import { initCountdown } from './countdown.js';
import { initNavigation } from './navigation.js';
import { initGift } from './gift.js';
import { initGallery } from './gallery.js';
import { initStoryCarousel } from './story-carousel.js';
import { initForms } from './forms.js';
import { initScrollProgress } from './scroll-progress.js';

window.toggleAudio = toggleAudio;

document.addEventListener('DOMContentLoaded', () => {
  initConfigRenderer();
  initUrlParams();
  initCover(() => playAudio());
  initAnimations();
  initAudio();
  initCountdown();
  initNavigation();
  initGift();
  initGallery();
  initStoryCarousel();
  initForms();
  initScrollProgress();

  // Re-observe dynamically added story chapters
  setTimeout(() => initAnimations(), 100);
});
