import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

export function initGallery() {
  const lightbox = new PhotoSwipeLightbox({
    gallery: '#gallery-grid',
    children: 'a',
    pswpModule: () => import('photoswipe'),
  });
  lightbox.init();
}
