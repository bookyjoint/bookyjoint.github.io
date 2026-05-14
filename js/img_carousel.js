window.addEventListener('DOMContentLoaded', () => {
  const carouselSlide = document.querySelector('.carousel-slide');
  const images = document.querySelectorAll('.carousel-slide img');
  const prevBtn = document.querySelector('#prevBtn');
  const nextBtn = document.querySelector('#nextBtn');

  if (!carouselSlide || images.length === 0 || !prevBtn || !nextBtn) {
    return;
  }

  let counter = 0;
  let size = images[0].clientWidth;

  const updateSize = () => {
    size = images[0].clientWidth;
    carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
  };

  window.addEventListener('resize', updateSize);
  updateSize();

  const goToSlide = (index) => {
    counter = (index + images.length) % images.length;
    carouselSlide.style.transition = 'transform 0.5s ease-in-out';
    carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
  };

  const nextSlide = () => goToSlide(counter + 1);
  const prevSlide = () => goToSlide(counter - 1);

  let autoplayInterval = setInterval(nextSlide, 4000);

  const resetAutoplay = () => {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextSlide, 4000);
  };

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  const carouselContainer = document.querySelector('.carousel-container');
  const modal = document.getElementById('imageModal');
  const modalClose = document.getElementById('modalClose');
  const modalImage = document.getElementById('modalImage');

  const openModal = (src, alt) => {
    if (!modal || !modalImage) return;
    modalImage.src = src;
    modalImage.alt = alt;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    clearInterval(autoplayInterval);
  };

  const closeModal = () => {
    if (!modal || !modalImage) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modalImage.src = '';
    resetAutoplay();
  };

  images.forEach((image) => {
    image.addEventListener('click', () => {
      openModal(image.src, image.alt);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carouselContainer.addEventListener('mouseleave', () => resetAutoplay());
  }
});
