import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export function initStoryCarousel() {
  const el = document.getElementById('story-swiper');
  if (!el) return;

  new Swiper(el, {
    modules: [Autoplay],
    slidesPerView: 4,
    spaceBetween: 2,
    loop: true,
    speed: 3000,
    autoplay: {
      delay: 1,
      disableOnInteraction: false,
    },
    allowTouchMove: true,
    breakpoints: {
      0: { slidesPerView: 4 },
      480: { slidesPerView: 3 },
    },
  });
}
