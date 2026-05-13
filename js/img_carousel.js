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
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carouselContainer.addEventListener('mouseleave', () => resetAutoplay());
  }
});
