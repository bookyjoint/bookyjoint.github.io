window.addEventListener('DOMContentLoaded', async () => {
  const carouselSlide = document.querySelector('.carousel-slide');
  const prevBtn = document.querySelector('#prevBtn');
  const nextBtn = document.querySelector('#nextBtn');

  if (!carouselSlide || !prevBtn || !nextBtn) {
    return;
  }

  // Load carousel images from manifest path set on the page.
  const manifestPath = carouselSlide.dataset.manifest || 'images/HomeCarousel/carousel-manifest.json';

  try {
    const response = await fetch(manifestPath);
    const imageList = await response.json();

    // Create and append img elements
    imageList.forEach(image => {
      const img = document.createElement('img');
      img.src = image.src;
      img.alt = image.alt;
      carouselSlide.appendChild(img);
    });
  } catch (error) {
    console.error('Error loading carousel manifest:', error);
    return;
  }

  // Get images after they've been created
  const images = document.querySelectorAll('.carousel-slide img');
  if (images.length === 0) {
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
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');
  const modalImage = document.getElementById('modalImage');

  let currentModalIndex = -1;

  const openModal = (index) => {
    if (!modal || !modalImage || index < 0 || index >= images.length) return;
    currentModalIndex = index;
    modalImage.src = images[index].src;
    modalImage.alt = images[index].alt;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    clearInterval(autoplayInterval);
  };

  const closeModal = () => {
    if (!modal || !modalImage) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modalImage.src = '';
    currentModalIndex = -1;
    resetAutoplay();
  };

  const nextModalImage = () => {
    if (currentModalIndex >= 0) {
      openModal((currentModalIndex + 1) % images.length);
    }
  };

  const prevModalImage = () => {
    if (currentModalIndex >= 0) {
      openModal((currentModalIndex - 1 + images.length) % images.length);
    }
  };

  Array.from(images).forEach((image, index) => {
    image.addEventListener('click', () => {
      openModal(index);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalPrev) {
    modalPrev.addEventListener('click', prevModalImage);
  }

  if (modalNext) {
    modalNext.addEventListener('click', nextModalImage);
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
