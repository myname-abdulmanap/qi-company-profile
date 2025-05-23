const galleryState = {
  clickHandlers: [],
  escHandler: null
};

function cleanupGallery() {
  galleryState.clickHandlers.forEach(({ el, handler }) => {
    el.removeEventListener('click', handler);
  });
  galleryState.clickHandlers = [];

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox-img');
  const closeBtn = lightbox?.querySelector('.close');

  if (lightbox) {
    lightbox.removeEventListener('click', closeHandler);
    if (galleryState.escHandler) {
      document.removeEventListener('keydown', galleryState.escHandler);
    }
    lightboxImg.src = '';
    lightbox.classList.remove('show');
  }
}

function closeHandler(e) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox-img');
  if (e.target === lightbox || e.target.classList.contains('close')) {
    lightbox.classList.remove('show');
    lightboxImg.src = '';
  }
}

function initGallery() {
  cleanupGallery();

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox-img');
  const closeBtn = lightbox?.querySelector('.close');

  document.querySelectorAll('.clickable').forEach(img => {
    const handler = () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('show');
    };
    img.addEventListener('click', handler);
    galleryState.clickHandlers.push({ el: img, handler });
  });

  if (lightbox) {
    lightbox.addEventListener('click', closeHandler);

    galleryState.escHandler = (e) => {
      if (e.key === 'Escape') {
        lightbox.classList.remove('show');
        lightboxImg.src = '';
      }
    };
    document.addEventListener('keydown', galleryState.escHandler);
  }
}

document.addEventListener('DOMContentLoaded', initGallery);
document.addEventListener('astro:page-load', initGallery);
document.addEventListener('astro:after-swap', initGallery);
document.addEventListener('astro:before-swap', cleanupGallery);

export { initGallery, cleanupGallery };
