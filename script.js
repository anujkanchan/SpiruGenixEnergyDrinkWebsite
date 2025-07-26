document.addEventListener('DOMContentLoaded', function () {
  const slider = document.querySelector('.slider .list');
  const allItems = document.querySelectorAll('.slider .item');
  const desktopItems = document.querySelectorAll('.item-desktop');
  const mobileItems = document.querySelectorAll('.item-mobile');
  const dots = document.querySelectorAll('.slider .dots li');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  let active = 0;
  let isTransitioning = false;
  let autoSlideInterval;

  // ✅ Slide waits for 4 seconds
  const intervalTime = 4000;

  let currentItems = [];

  function getCurrentItems() {
    return window.innerWidth <= 768 ? [...mobileItems] : [...desktopItems];
  }

  function setupSlider() {
    currentItems = getCurrentItems();

    slider.innerHTML = '';
    const slideWidth = window.innerWidth;

    const firstClone = currentItems[0].cloneNode(true);
    const lastClone = currentItems[currentItems.length - 1].cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');

    slider.appendChild(lastClone);
    currentItems.forEach(item => slider.appendChild(item));
    slider.appendChild(firstClone);

    allSliderItems = slider.querySelectorAll('.item');

    slider.style.width = `${allSliderItems.length * slideWidth}px`;
    allSliderItems.forEach(item => {
      item.style.width = `${slideWidth}px`;
    });

    slider.style.transition = 'none';
    slider.style.transform = `translateX(-${slideWidth}px)`;
    setTimeout(() => {
      slider.style.transition = 'transform 1.5s ease';
    }, 50);
  }

  function updateDots() {
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[active]) dots[active].classList.add('active');
  }

  function goToSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    const total = currentItems.length;
    const slideWidth = window.innerWidth;
    active = index;

    slider.style.transition = 'transform 1.5s ease';
    slider.style.transform = `translateX(-${(index + 1) * slideWidth}px)`;

    updateDots();

    slider.addEventListener('transitionend', () => {
      if (active >= total) {
        active = 0;
        slider.style.transition = 'none';
        slider.style.transform = `translateX(-${slideWidth}px)`;
        setTimeout(() => {
          slider.style.transition = 'transform 1.5s ease';
        }, 50);
      } else if (active < 0) {
        active = total - 1;
        slider.style.transition = 'none';
        slider.style.transform = `translateX(-${total * slideWidth}px)`;
        setTimeout(() => {
          slider.style.transition = 'transform 1.5s ease';
        }, 50);
      }
      isTransitioning = false;
    }, { once: true });
  }

  function nextSlide() {
    goToSlide(active + 1);
  }

  function prevSlide() {
    goToSlide(active - 1);
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, intervalTime);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  setupSlider();
  updateDots();
  startAutoSlide();

  window.addEventListener('resize', () => {
    active = 0;
    setupSlider();
    updateDots();
  });

  nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (active !== index) {
        stopAutoSlide();
        goToSlide(index);
        startAutoSlide();
      }
    });
  });

  const sliderContainer = document.querySelector('.slider');
  let startX = 0;
  let endX = 0;
  const swipeThreshold = 50;

  sliderContainer.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  sliderContainer.addEventListener('touchmove', e => endX = e.touches[0].clientX);
  sliderContainer.addEventListener('touchend', () => {
    if (startX - endX > swipeThreshold) {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    } else if (endX - startX > swipeThreshold) {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    }
  });

  sliderContainer.addEventListener('mouseenter', stopAutoSlide);
  sliderContainer.addEventListener('mouseleave', startAutoSlide);

  // ✅ Added Email Form Submission Code Below
 const form = document.getElementById('emailForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Stops page reload
  const email = form.email.value;

  const response = await fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  if (response.ok) {
    message.style.display = "block";
    message.style.color = "green";
    message.textContent = "Email submitted successfully!";
    form.reset();
    setTimeout(() => message.style.display = "none", 3000); 
  } else {
    message.style.display = "block";
    message.style.color = "red";
    message.textContent = "Error submitting email.";
  }
});
});
