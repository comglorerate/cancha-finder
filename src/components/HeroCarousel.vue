<template>
  <div
    class="hero-carousel"
    role="region"
    aria-roledescription="carousel"
    aria-label="Destacados de canchas"
  >
    <div class="carousel-container">
      <transition-group name="fade" tag="div" class="carousel-inner">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          v-show="currentSlide === index"
          class="carousel-slide"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${index + 1} de ${slides.length}: ${slide.title}`"
        >
          <div class="carousel-overlay"></div>
          <img
            :src="slide.image"
            :alt="slide.title"
            class="carousel-image"
            @error="handleImageError($event, index)"
          />
          <div class="carousel-caption">
            <h3>{{ slide.title }}</h3>
            <p>{{ slide.description }}</p>
          </div>
        </div>
      </transition-group>

      <div class="carousel-controls">
        <button
          @click="prevSlide"
          @mouseenter="pauseTimer"
          @mouseleave="resumeTimer"
          class="carousel-control prev"
          aria-label="Slide anterior"
        >
          <font-awesome-icon icon="chevron-left" />
        </button>
        <div class="carousel-indicators" role="tablist">
          <button
            v-for="(slide, index) in slides"
            :key="index"
            @click="goToSlide(index)"
            @mouseenter="pauseTimer"
            @mouseleave="resumeTimer"
            :class="['indicator', { active: currentSlide === index }]"
            :aria-label="`Ir a slide ${index + 1}`"
            :aria-selected="currentSlide === index"
            role="tab"
          ></button>
        </div>
        <button
          @click="nextSlide"
          @mouseenter="pauseTimer"
          @mouseleave="resumeTimer"
          class="carousel-control next"
          aria-label="Slide siguiente"
        >
          <font-awesome-icon icon="chevron-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

// Estado reactivo
const currentSlide = ref(0);
const slides = ref([
  {
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68",
    title: "Canchas de Fútbol Premium",
    description: "Césped sintético de última generación",
  },
  {
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0",
    title: "Canchas de Tenis Profesionales",
    description: "Superficie perfecta para tu mejor juego",
  },
  {
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    title: "Básquet Indoor y Outdoor",
    description: "Canchas para todas las condiciones climáticas",
  },
]);
const timer = ref(null);
const isPaused = ref(false);
const defaultImage =
  "https://via.placeholder.com/800x400?text=Imagen+no+disponible";

// Referencias para eventos táctiles
let touchStart = null;
let touchEnd = null;

// Métodos
const startSlideTimer = () => {
  if (timer.value === null) {
    timer.value = setInterval(() => {
      if (!isPaused.value) {
        nextSlide();
      }
    }, 5000);
  }
};

const stopSlideTimer = () => {
  clearInterval(timer.value);
  timer.value = null;
};

const pauseTimer = () => {
  isPaused.value = true;
};

const resumeTimer = () => {
  isPaused.value = false;
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

const handleImageError = (event, index) => {
  event.target.src = defaultImage;
  console.error(`Error cargando imagen para slide ${index + 1}`);
};

const handleSwipe = (startX, endX) => {
  const threshold = 50;
  if (startX - endX > threshold) {
    nextSlide();
  } else if (endX - startX > threshold) {
    prevSlide();
  }
};

// Setup de eventos táctiles
const setupTouchEvents = () => {
  const carousel = document.querySelector(".carousel-container");
  if (!carousel) return;

  let touchStartX = 0;
  let touchEndX = 0;

  touchStart = (e) => {
    pauseTimer();
    touchStartX = e.changedTouches[0].screenX;
  };

  touchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe(touchStartX, touchEndX);
    resumeTimer();
  };

  carousel.addEventListener("touchstart", touchStart);
  carousel.addEventListener("touchend", touchEnd);
};

// Eliminar eventos táctiles
const removeTouchEvents = () => {
  const carousel = document.querySelector(".carousel-container");
  if (!carousel) return;

  if (touchStart) {
    carousel.removeEventListener("touchstart", touchStart);
  }
  if (touchEnd) {
    carousel.removeEventListener("touchend", touchEnd);
  }
};

onMounted(() => {
  startSlideTimer();
  setTimeout(setupTouchEvents, 100);
});

onBeforeUnmount(() => {
  stopSlideTimer();
  removeTouchEvents();
});
</script>

<style scoped>
.hero-carousel {
  width: 100%;
  margin-bottom: 2rem;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 1rem;
}

.carousel-inner {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.6)
  );
}

.carousel-caption {
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  padding: 0 2rem;
  z-index: 5;
}

.carousel-caption h3 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.carousel-caption p {
  font-size: 1.1rem;
  opacity: 0.9;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  max-width: 600px;
  margin: 0 auto;
}

.carousel-controls {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

.carousel-indicators {
  display: flex;
  gap: 10px;
  margin: 0 15px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.indicator.active {
  background-color: white;
  transform: scale(1.2);
}

.carousel-control {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-control:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .carousel-container {
    height: 300px;
  }

  .carousel-caption {
    bottom: 40px;
    height: 80px;
  }

  .carousel-caption h3 {
    font-size: 1.5rem;
  }

  .carousel-caption p {
    font-size: 0.9rem;
  }

  .carousel-control {
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 576px) {
  .carousel-container {
    height: 250px;
  }

  .carousel-caption {
    bottom: 30px;
    padding: 0 1rem;
    height: 70px;
  }

  .carousel-caption h3 {
    font-size: 1.2rem;
    margin-bottom: 0.3rem;
  }

  .carousel-caption p {
    font-size: 0.85rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .carousel-controls {
    bottom: 10px;
  }

  .indicator {
    width: 8px;
    height: 8px;
  }

  .carousel-control {
    width: 30px;
    height: 30px;
  }
}

@media (max-width: 400px) {
  .carousel-container {
    height: 200px;
    border-radius: 0.75rem;
  }

  .carousel-caption {
    bottom: 20px;
    height: 70px;
  }

  .carousel-caption h3 {
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }

  .carousel-caption p {
    font-size: 0.8rem;
    -webkit-line-clamp: 1;
  }

  .carousel-control {
    width: 25px;
    height: 25px;
    font-size: 0.8rem;
  }

  .indicator {
    width: 6px;
    height: 6px;
  }
}
</style>
