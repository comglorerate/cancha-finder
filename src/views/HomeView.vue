<template>
  <div class="home">
    <section class="hero">
      <div class="container hero-content">
        <h1 class="hero-title">
          Cancha<span class="gradient-text">Finder-</span>
        </h1>
        <p class="hero-subtitle">
          Tu destino definitivo para encontrar y reservar canchas deportivas.
          Rápido, fácil y sin complicaciones.
        </p>

        <div class="hero-media">
          <HeroCarousel />
        </div>

        <div class="quick-search">
          <form @submit.prevent="searchCanchas" class="search-form">
            <div class="search-inputs">
              <div class="input-group">
                <font-awesome-icon icon="map-marker-alt" />
                <v-select
                  v-model="searchForm.location"
                  :options="locationOptions"
                  placeholder="       Selecciona una ubicación"
                  :clearable="false"
                ></v-select>
              </div>

              <div class="input-group">
                <font-awesome-icon icon="futbol" />
                <v-select
                  v-model="searchForm.sport"
                  :options="sportOptions"
                  placeholder="       Todos los deportes"
                  :clearable="false"
                ></v-select>
              </div>

              <div class="input-group">
                <font-awesome-icon icon="calendar" />
                <input
                  type="date"
                  v-model="searchForm.date"
                  placeholder="Fecha"
                />
              </div>
            </div>

            <button type="submit" class="btn btn-primary search-btn">
              <font-awesome-icon icon="search" /> Buscar
            </button>
          </form>
        </div>

        <router-link to="/canchas" class="btn btn-primary explore-btn">
          Explorar Canchas <font-awesome-icon icon="arrow-right" />
        </router-link>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2 class="section-title">
          ¿Por qué elegir <span class="gradient-text">CanchaFinder</span>?
        </h2>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon icon="search" />
            </div>
            <h3>Búsqueda fácil</h3>
            <p>
              Encuentra la cancha perfecta con nuestro sistema de búsqueda
              avanzada.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon icon="calendar-alt" />
            </div>
            <h3>Reserva instantánea</h3>
            <p>
              Reserva tu cancha con solo unos clics, sin llamadas telefónicas.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <font-awesome-icon icon="map-marker-alt" />
            </div>
            <h3>Ubicación cercana</h3>
            <p>
              Descubre canchas cerca de ti con nuestra función de
              geolocalización.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="popular-sports">
      <div class="container">
        <h2 class="section-title">Deportes Disponibles</h2>
        <div class="sports-grid">
          <div
            v-for="(sport, index) in popularSports"
            :key="index"
            class="sport-card"
          >
            <div class="sport-icon">
              <img
                v-if="getSportImage(sport.name)"
                :src="getSportImage(sport.name)"
                :alt="sport.name"
                class="sport-image"
              />
              <font-awesome-icon v-else :icon="['fas', sport.icon]" />
            </div>
            <h3>{{ sport.name }}</h3>
            <p>{{ sport.count }} canchas disponibles</p>
            <router-link
              :to="{ path: '/canchas', query: { deporte: sport.name } }"
              class="btn btn-outline"
            >
              Ver Canchas
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-courts">
      <div class="container">
        <h2 class="section-title">Canchas Destacadas</h2>
        <div class="courts-slider">
          <div
            v-for="(court, index) in featuredCourts"
            :key="index"
            class="court-card"
          >
            <div class="court-image">
              <img
                :src="court.image"
                :alt="court.name"
                @error="handleImageError"
              />
              <div class="court-price">${{ court.price }}/hora</div>
            </div>
            <div class="court-details">
              <h3>{{ court.name }}</h3>
              <div class="court-rating">
                <font-awesome-icon
                  icon="star"
                  v-for="n in Math.floor(court.rating)"
                  :key="n"
                />
                <span class="rating-text"
                  >{{ court.rating }} ({{ court.reviews }})</span
                >
              </div>
              <p>{{ court.location }}</p>
              <div class="court-sports">
                <span
                  v-for="(sport, i) in court.sports"
                  :key="i"
                  class="sport-tag"
                >
                  {{ sport }}
                </span>
              </div>
              <router-link :to="'/canchas/' + court.id" class="btn btn-outline">
                Ver Detalles
              </router-link>
            </div>
          </div>
        </div>
        <div class="view-all">
          <router-link to="/canchas" class="btn btn-primary explore-btn">
            Ver Todas las Canchas
          </router-link>
        </div>
      </div>
    </section>

    <section class="testimonials">
      <div class="container">
        <h2 class="section-title">Lo que dicen nuestros usuarios</h2>
        <div class="testimonials-grid">
          <div
            v-for="(testimonial, index) in testimonials"
            :key="index"
            class="testimonial-card"
          >
            <div class="testimonial-rating">
              <font-awesome-icon
                icon="star"
                v-for="n in testimonial.rating"
                :key="n"
              />
            </div>
            <p class="testimonial-text">"{{ testimonial.text }}"</p>
            <div class="testimonial-author">
              <div class="author-avatar">
                <img :src="testimonial.avatar" :alt="testimonial.name" />
              </div>
              <div class="author-info">
                <h4>{{ testimonial.name }}</h4>
                <p>{{ testimonial.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <h3>{{ stats.canchas }}+</h3>
            <p>Canchas Registradas</p>
          </div>
          <div class="stat-card">
            <h3>{{ stats.usuarios }}+</h3>
            <p>Usuarios Satisfechos</p>
          </div>
          <div class="stat-card">
            <h3>{{ stats.reservas }}+</h3>
            <p>Reservas Realizadas</p>
          </div>
          <div class="stat-card">
            <h3>{{ stats.ciudades }}</h3>
            <p>Ciudades Disponibles</p>
          </div>
        </div>
      </div>
    </section>

    <section class="faq">
      <div class="container">
        <h2 class="section-title">Preguntas Frecuentes</h2>
        <div class="faq-container">
          <div v-for="(item, index) in faqs" :key="index" class="faq-item">
            <div class="faq-question" @click="toggleFaq(index)">
              <h3>{{ item.question }}</h3>
              <font-awesome-icon
                :icon="activeFaq === index ? 'chevron-up' : 'chevron-down'"
              />
            </div>
            <div class="faq-answer" :class="{ active: activeFaq === index }">
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2>¿Listo para reservar tu cancha?</h2>
          <p>Únete a miles de deportistas que ya disfrutan de CanchaFinder.</p>
          <div class="cta-buttons">
            <router-link
              :to="{ path: '/login', query: { tab: 'register' } }"
              class="btn btn-primary"
            >
              Registrarse Gratis
            </router-link>
            <router-link to="/canchas" class="btn btn-outline-white">
              Explorar Canchas
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <div
      v-if="isLoading"
      class="loading-indicator"
      role="status"
      aria-live="polite"
    >
      <div class="spinner"></div>
      <span class="sr-only">Cargando...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { canchas } from "../data/canchas";
import HeroCarousel from "../components/HeroCarousel.vue";

const router = useRouter();

const isLoading = ref(true);
const searchForm = ref({
  location: "",
  sport: "",
  date: "",
});
const activeFaq = ref(null);
const featuredCourtIds = [1, 2, 3];
const defaultImage = "https://via.placeholder.com/800x600?text=CanchaFinder";
const testimonials = ref([
  {
    rating: 5,
    text: "CanchaFinder me ayudó a encontrar y reservar canchas de fútbol sin complicaciones.",
    name: "Carlos Rodríguez",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    location: "Buenos Aires",
  },
  {
    rating: 5,
    text: "La mejor plataforma para reservar canchas de tenis. Interfaz intuitiva y excelente servicio.",
    name: "María López",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    location: "Córdoba",
  },
  {
    rating: 4,
    text: "Fantástico servicio que ahorra mucho tiempo. Ya no tengo que llamar a diferentes lugares para consultar disponibilidad.",
    name: "Juan Gómez",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    location: "Rosario",
  },
]);

const stats = ref({
  canchas: 150,
  usuarios: 5000,
  reservas: 12500,
  ciudades: 10,
});

const faqs = ref([
  {
    question: "¿Cómo reservo una cancha?",
    answer:
      "Simplemente busca la cancha que deseas, selecciona la fecha y hora disponible, y completa el proceso de pago. Recibirás una confirmación por email.",
  },
  {
    question: "¿Puedo cancelar mi reserva?",
    answer:
      "Sí, puedes cancelar tu reserva hasta 24 horas antes de la hora programada para recibir un reembolso completo.",
  },
  {
    question: "¿Cómo puedo pagar?",
    answer:
      "Aceptamos tarjetas de crédito/débito, transferencia bancaria y algunos métodos de pago electrónico como Mercado Pago.",
  },
  {
    question: "¿Puedo reservar canchas recurrentes?",
    answer:
      "Sí, ofrecemos la opción de reservar el mismo horario semanalmente o mensualmente con descuentos especiales.",
  },
]);

const locationOptions = [
  { label: "Selecciona una ubicación", value: "" },
  { label: "Zona Norte", value: "norte" },
  { label: "Zona Sur", value: "sur" },
  { label: "Zona Este", value: "este" },
  { label: "Zona Oeste", value: "oeste" },
  { label: "Centro", value: "centro" },
];

const sportOptions = [
  { label: "Todos los deportes", value: "" },
  { label: "Fútbol", value: "futbol" },
  { label: "Tenis", value: "tenis" },
  { label: "Básquet", value: "basquet" },
  { label: "Pádel", value: "padel" },
  { label: "Vóley", value: "voley" },
];

const sportIcons = {
  Fútbol: "futbol",
  Tenis: "table-tennis",
  Básquet: "basketball-ball",
  Pádel: "table-tennis",
  Vóley: "volleyball-ball",
};

const sportImages = {
  Fútbol: "https://cdn-icons-png.flaticon.com/512/5562/5562847.png",
  Tenis: "https://cdn-icons-png.flaticon.com/512/2158/2158416.png",
  Básquet: "https://cdn-icons-png.flaticon.com/512/889/889455.png",
  Pádel: "https://cdn-icons-png.flaticon.com/512/3473/3473591.png",
  Vóley: "https://cdn-icons-png.flaticon.com/512/3042/3042781.png",
  Rugby: "https://cdn-icons-png.flaticon.com/512/1099/1099772.png",
};

const popularSports = computed(() => {
  const sportCounts = {};

  canchas.forEach((cancha) => {
    if (!sportCounts[cancha.tipo]) {
      sportCounts[cancha.tipo] = 0;
    }
    sportCounts[cancha.tipo]++;
  });

  const sports = Object.keys(sportCounts).map((tipo) => {
    const id = tipo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/\s+/g, ""); // Eliminar espacios

    return {
      id,
      name: tipo,
      icon: sportIcons[tipo] || "futbol",
      count: sportCounts[tipo],
    };
  });

  return sports.sort((a, b) => b.count - a.count);
});

const featuredCourts = computed(() => {
  return featuredCourtIds
    .map((id) => {
      const cancha = canchas.find((c) => c.id === id);
      if (!cancha) return null;

      return {
        id: cancha.id,
        name: cancha.nombre,
        image: cancha.imagen,
        price: cancha.precio || 1500,
        rating: cancha.calificacion || 4.5,
        reviews: cancha.resenas?.length || Math.floor(Math.random() * 100) + 20,
        location: cancha.ubicacion,
        sports: [cancha.tipo],
      };
    })
    .filter((court) => court !== null);
});

const totalCanchas = computed(() => {
  return canchas.length;
});

const searchCanchas = () => {
  router.push({
    path: "/canchas",
    query: {
      ubicacion: searchForm.value.location,
      deporte: searchForm.value.sport,
      fecha: searchForm.value.date,
    },
  });
};

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index;
};

const getSportImage = (sportName) => {
  return sportImages[sportName];
};

const handleImageError = (e, altText = "Imagen no disponible") => {
  console.warn(`Error cargando imagen: ${e.target.alt || altText}`);
  e.target.src = defaultImage;
};

onMounted(() => {
  stats.value.canchas = totalCanchas.value;
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
</script>

<style scoped>
.hero {
  padding: 4rem 0;
  background: linear-gradient(
    rgba(20, 184, 166, 0.05),
    rgba(236, 72, 153, 0.05)
  );
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.hero-media {
  margin: 2rem 0;
  max-width: 100%;
  border-radius: 1rem;
  overflow: hidden;
}

.video-placeholder {
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background-color: #94a3b8;
  border-radius: 1rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-bottom: 2rem;
}

.play-button {
  position: absolute;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
}

.explore-btn {
  font-size: 1.1rem;
  padding: 0.75rem 2rem;
}

.features {
  padding: 5rem 0;
}

.section-title {
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background-color: rgba(20, 184, 166, 0.1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 1.5rem;
  color: var(--primary-color);
  font-size: 1.5rem;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #64748b;
  line-height: 1.6;
}

/* Estilos adicionales */
.quick-search {
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

/* Corregir el media query para search-form */

.search-inputs {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  flex: 1;
  width: 100%;
}

.input-group {
  position: relative;
  flex: 1;
  min-width: 200px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 0.5rem;
}

.input-group svg {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  z-index: 1;
}

.input-group select,
.input-group input,
.input-group .vs__dropdown-toggle {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.search-btn {
  padding: 0.75rem 2rem;
  white-space: nowrap;
  width: auto;
}

/* Popular Sports */
.popular-sports {
  padding: 5rem 0;
  background-color: #f8fafc;
}

.sports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.sport-card {
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.sport-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.sport-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(
    135deg,
    rgba(20, 184, 166, 0.15) 0%,
    rgba(236, 72, 153, 0.15) 100%
  );
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--primary-color);
  overflow: hidden;
  padding: 15px;
}

.sport-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.sport-card:hover .sport-image {
  transform: scale(1.1);
}

.sport-card h3 {
  margin-bottom: 0.5rem;
}

.sport-card p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

/* Featured Courts */
.featured-courts {
  padding: 5rem 0;
}

.courts-slider {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.court-card {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  background-color: white;
  transition: all 0.3s ease;
}

.court-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
}

.court-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.court-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.court-card:hover .court-image img {
  transform: scale(1.05);
}

.court-price {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: bold;
}

.court-details {
  padding: 1.5rem;
}

.court-rating {
  color: #f59e0b;
  margin-bottom: 0.5rem;
}

.rating-text {
  color: #64748b;
  margin-left: 0.5rem;
}

.court-sports {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.sport-tag {
  background-color: rgba(20, 184, 166, 0.1);
  color: var(--primary-color);
  padding: 0.2rem 0.8rem;
  border-radius: 2rem;
  font-size: 0.8rem;
}

.view-all {
  text-align: center;
  margin-top: 2rem;
}

/* Testimonials */
.testimonials {
  padding: 5rem 0;
  background-color: #f8fafc;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.testimonial-rating {
  color: #f59e0b;
  margin-bottom: 1rem;
}

.testimonial-text {
  font-style: italic;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: #334155;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info h4 {
  margin: 0 0 0.2rem 0;
}

.author-info p {
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
}

/* Stats */
.stats {
  padding: 5rem 0;
  background: linear-gradient(
    135deg,
    rgba(20, 184, 166, 0.1) 0%,
    rgba(236, 72, 153, 0.1) 100%
  );
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-card h3 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

/* FAQ */
.faq {
  padding: 5rem 0;
}

.faq-container {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.faq-question {
  padding: 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.faq-question h3 {
  font-size: 1.1rem;
  margin: 0;
}

.faq-answer {
  height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-answer.active {
  height: auto;
  padding-bottom: 1.5rem;
}

.cta {
  padding: 5rem 0;
  background: linear-gradient(
    135deg,
    rgb(20, 184, 166) 0%,
    rgb(236, 72, 153) 100%
  );
  color: white;
}

.cta-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;
}

.cta h2 {
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.cta p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
}

.cta-buttons a {
  min-width: 150px;
  text-align: center;
  flex-shrink: 0;
}

.btn-outline-white {
  border: 2px solid white;
  background: transparent;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-outline-white:hover {
  background-color: white;
  color: var(--primary-color);
}

/* Indicador de carga */
.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  width: 100%;
  flex-direction: column;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(20, 184, 166, 0.2);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Avatar fallback para errores */
.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.avatar-fallback::after {
  content: attr(data-initial);
}

/* Media queries para responsividad */
@media (max-width: 1200px) {
  .hero-content {
    max-width: 90%;
  }
}

@media (max-width: 992px) {
  .sports-grid,
  .features-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  .courts-slider {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .hero-title {
    font-size: 2.7rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .stat-card h3 {
    font-size: 2rem;
  }

  .cta h2 {
    font-size: 1.8rem;
  }

  .hero-media {
    margin: 1.5rem 0;
  }

  .quick-search {
    padding: 1rem;
  }

  .search-form {
    flex-direction: column;
  }

  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 1rem;
    max-width: 100%;
  }

  .cta-buttons a {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .hero-media {
    margin: 1rem 0;
  }

  .search-inputs {
    flex-direction: column;
    width: 100%;
  }

  .input-group {
    width: 100%;
    min-width: 100%;
    margin-bottom: 0.5rem;
  }

  .input-group:last-child {
    margin-bottom: 0;
  }

  .search-btn {
    width: 100%;
  }

  .courts-slider {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .stat-card h3 {
    font-size: 1.5rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .explore-btn {
    width: 100%;
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 430px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .feature-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }

  .sport-icon {
    width: 60px;
    height: 60px;
    padding: 10px;
  }

  .faq-question h3 {
    font-size: 0.9rem;
  }
}
</style>
