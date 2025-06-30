<template>
  <div class="cancha-detail" v-if="cancha && !isLoading">
    <div class="container">
      <div class="back-link" @click="volver">&larr; Volver a la lista.</div>

      <div class="detail-header">
        <div class="detail-header-content">
          <h1 class="detail-title">{{ cancha.nombre }}</h1>
          <div class="detail-meta">
            <div class="detail-type">
              <span class="detail-badge">{{ cancha.tipo }}</span>
              <span class="detail-badge">{{ cancha.tamaño }}</span>
              <span class="detail-badge">{{ cancha.superficie }}</span>
            </div>
            <div class="detail-rating">
              <span
                class="stars"
                v-html="showStars(cancha.calificacion)"
              ></span>
              <span class="reviews"
                >{{ cancha.calificacion }} ({{ cancha.reseñas }} reseñas)</span
              >
            </div>
          </div>
          <div class="detail-location">
            <font-awesome-icon icon="map-marker-alt" />
            <span>{{ cancha.ubicacion }}</span>
          </div>
        </div>
        <div class="detail-price">
          <div class="price-amount">{{ cancha.precio }}€</div>
          <div class="price-unit">por hora</div>
          <button
            @click="toggleFavorito"
            class="fav-button"
            :class="{ 'is-favorite': esFavorito }"
          >
            <font-awesome-icon icon="heart" />
          </button>
        </div>
      </div>

      <div class="detail-content">
        <div class="detail-main">
          <div class="detail-gallery">
            <img
              :src="cancha.imagen"
              :alt="'Imagen de ' + cancha.nombre"
              class="detail-image"
              @error="handleImageError"
            />
          </div>

          <div class="detail-description">
            <h2>Descripción</h2>
            <p>{{ cancha.descripcion }}</p>
          </div>

          <div class="detail-services">
            <h2>Servicios</h2>
            <div class="services-list">
              <div
                v-for="(servicio, index) in cancha.servicios"
                :key="index"
                class="service-item"
              >
                <font-awesome-icon icon="check-circle" />
                <span>{{ servicio }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-sidebar">
          <div class="booking-card">
            <h2>Reservar ahora</h2>

            <div class="booking-form">
              <div class="form-group">
                <label>Fecha</label>
                <input
                  type="date"
                  class="form-control"
                  :min="today"
                  v-model="selectedDate"
                />
              </div>

              <div class="form-group">
                <label>Horario disponible</label>
                <v-select
                  :options="cancha.horarios"
                  v-model="selectedHorario"
                  placeholder="Selecciona un horario"
                  :clearable="false"
                  class="form-control"
                ></v-select>
              </div>

              <div class="form-group">
                <label>Duración</label>
                <v-select
                  :options="duracionOptions"
                  v-model="selectedDuracion"
                  :clearable="false"
                  class="form-control"
                ></v-select>
              </div>
            </div>

            <div class="booking-info">
              <div class="info-item">
                <font-awesome-icon icon="info-circle" />
                <span>Cancelación gratuita hasta 24h antes</span>
              </div>
            </div>

            <div class="booking-actions">
              <div v-if="selectedHorario" class="selected-time">
                <p>
                  Horario seleccionado:
                  <strong>{{ selectedHorario }}</strong>
                </p>
                <button
                  @click="reservarCancha"
                  class="btn btn-primary book-btn"
                >
                  <font-awesome-icon icon="calendar-check" /> Reservar Cancha
                </button>
              </div>
              <div v-else class="select-time-prompt">
                <p>Selecciona un horario disponible para reservar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="loading-state" v-else-if="isLoading">
    <div class="loading-spinner" role="status" aria-live="polite"></div>
    <span class="sr-only">Cargando información de la cancha...</span>
  </div>
  <div class="not-found" v-else>
    <div class="container">
      <p>Cancha no encontrada</p>
      <button @click="volver" class="btn btn-primary">Volver a la lista</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { canchas } from "../data/canchas";
import { usuariosStore } from "../data/usuarios";

const router = useRouter();
const route = useRoute();

const canchaId = computed(() => Number(route.params.id));
const cancha = ref(null);
const selectedHorario = ref(null);
const selectedDuracion = ref({ label: "1 hora", value: 1 });
const selectedDate = ref(new Date());
const isLoading = ref(true);
const isAuthenticated = computed(() => usuariosStore.isAuthenticated);

const today = computed(() => {
  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
});

const duracionOptions = [
  { label: "1 hora", value: 1 },
  { label: "2 horas", value: 2 },
  { label: "3 horas", value: 3 },
];

const volver = () => {
  router.push({ name: "canchas" });
};

const showStars = (rating) => {
  const starFull = '<span class="star full">★</span>';
  const starHalf = '<span class="star half">★</span>';
  const starEmpty = '<span class="star empty">★</span>';

  let stars = "";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Generar estrellas llenas
  for (let i = 0; i < fullStars; i++) {
    stars += starFull;
  }

  // Agregar media estrella si es necesario
  if (hasHalfStar) {
    stars += starHalf;
  }

  // Agregar estrellas vacías
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars += starEmpty;
  }

  return stars;
};

const reservarCancha = () => {
  if (!selectedHorario.value) {
    alert("Por favor, selecciona un horario para reservar");
    return;
  }

  router.push({
    name: "reservaConfirmacion",
    params: {
      canchaId: cancha.value.id,
    },
    query: {
      hora: selectedHorario.value,
      fecha:
        selectedDate.value instanceof Date
          ? selectedDate.value.toISOString().split("T")[0]
          : selectedDate.value,
      duracion: selectedDuracion.value.value,
    },
  });
};

const esFavorito = computed(() => {
  return usuariosStore.esFavorito(canchaId.value);
});

const toggleFavorito = () => {
  if (!isAuthenticated.value) {
    router.push({
      name: "login",
      query: { redirect: router.currentRoute.value.fullPath },
    });
    return;
  }
  usuariosStore.toggleFavorito(canchaId.value);
};

const handleImageError = (event) => {
  event.target.src =
    "https://via.placeholder.com/800x400?text=Imagen+no+disponible";
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const foundCancha = canchas.find((c) => c.id === canchaId.value);
    if (foundCancha) {
      cancha.value = foundCancha;
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Layout */
.cancha-detail {
  padding: 3rem 0;
}

.back-link {
  color: #64748b;
  cursor: pointer;
  margin-bottom: 1.5rem;
  display: inline-block;
}

.not-found {
  padding: 5rem 0;
  text-align: center;
}

.not-found p {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #64748b;
}

/* Estado de carga */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 200px);
  flex-direction: column;
}

.loading-spinner {
  border: 4px solid rgba(20, 184, 166, 0.3);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
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

/* Cabecera */
.detail-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.detail-header-content {
  flex: 1;
}

.detail-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.detail-type {
  font-size: 1rem;
  display: flex;
  gap: 0.5rem;
}

.detail-badge {
  background-color: rgba(20, 184, 166, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
}

.detail-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
}

.detail-price {
  background-color: var(--primary-color);
  color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 150px;
  position: relative;
}

.price-amount {
  font-size: 2rem;
  font-weight: 700;
}

.price-unit {
  font-size: 0.9rem;
}

/* Contenido principal */
.detail-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-gallery {
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
}

.detail-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

/* Sistema de estrellas */
.star {
  font-size: 1.2rem;
}

.star.full {
  color: #fbbf24;
}

.star.half {
  position: relative;
  color: #e5e7eb;
}

.star.half::after {
  content: "★";
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  overflow: hidden;
  color: #fbbf24;
}

.star.empty {
  color: #e5e7eb;
}

.reviews {
  font-size: 0.9rem;
  color: #64748b;
}

/* Títulos de secciones */
.detail-description h2,
.detail-services h2,
.booking-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.booking-card h2 {
  text-align: center;
  margin-bottom: 1.8rem;
  color: #2d3748;
  padding-bottom: 12px;
  position: relative;
}

.booking-card h2::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, var(--primary-color), #38b2ac);
  border-radius: 3px;
}

.detail-description p {
  color: #64748b;
  line-height: 1.6;
}

/* Servicios */
.services-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.service-item,
.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
}

.service-item svg,
.info-item svg {
  color: var(--primary-color);
}

.info-item {
  font-size: 0.9rem;
}

/* Reservas */
.booking-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1.8rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  position: relative;
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.3s ease;
}

.booking-card:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.form-group label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95rem;
}

.form-control {
  padding: 0.9rem 1.2rem;
  border-radius: 0.7rem;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.15);
  outline: none;
}

.form-control.vs__dropdown-toggle {
  padding: 0.7rem 1rem;
  height: auto;
}

.booking-info {
  margin-top: 1.8rem;
  padding: 1.2rem;
  border-top: 1px solid #e2e8f0;
  background-color: rgba(240, 249, 255, 0.5);
  border-radius: 0.7rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: #4a5568;
  font-size: 0.9rem;
}

.info-item svg {
  color: var(--primary-color);
  font-size: 1.1rem;
}

/* Acciones de reserva */
.booking-actions {
  margin: 1.8rem 0 0.5rem;
  padding: 1.5rem;
  background: linear-gradient(to right bottom, #f7fafc, #edf2f7);
  border-radius: 0.8rem;
  text-align: center;
  border: 1px dashed #e2e8f0;
}

.selected-time {
  font-size: 1.1rem;
}

.selected-time p {
  margin-bottom: 1.2rem;
  color: #2d3748;
  font-weight: 500;
}

.selected-time strong {
  color: var(--primary-color);
  font-weight: 700;
}

.book-btn {
  margin-top: 0.8rem;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  width: 100%;
  background: linear-gradient(to right, var(--primary-color), #38b2ac);
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
  border: none;
  transition: all 0.3s ease;
}

.book-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(20, 184, 166, 0.4);
}

.book-btn:active {
  transform: translateY(-1px);
}

.select-time-prompt {
  color: #4a5568;
  font-style: italic;
  font-size: 1rem;
  padding: 0.5rem;
}

/* Favoritos */
.fav-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.fav-button.is-favorite {
  color: #f44336;
}

.fav-button:hover {
  transform: scale(1.1);
}

/* Responsividad */
@media (max-width: 992px) {
  .detail-content {
    grid-template-columns: 1.5fr 1fr;
    gap: 1.5rem;
  }

  .detail-image {
    height: 350px;
  }

  .booking-card {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .detail-content {
    grid-template-columns: 1fr;
  }

  .detail-header {
    flex-direction: column;
    gap: 1.5rem;
  }

  .detail-price {
    width: 100%;
    min-width: auto;
    padding: 1.25rem;
  }

  .detail-title {
    font-size: 1.8rem;
  }

  .detail-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .detail-image {
    height: 300px;
  }

  .service-item {
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .cancha-detail {
    padding: 2rem 0;
  }

  .detail-header-content {
    width: 100%;
  }

  .detail-title {
    font-size: 1.5rem;
  }

  .detail-type {
    flex-wrap: wrap;
  }

  .detail-badge {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }

  .detail-image {
    height: 250px;
  }

  .services-list {
    grid-template-columns: 1fr;
  }

  .booking-form {
    gap: 1.2rem;
  }

  .booking-actions {
    padding: 1.2rem;
  }
}

@media (max-width: 430px) {
  .detail-image {
    height: 200px;
  }

  .booking-card {
    padding: 1.2rem;
  }

  .booking-actions {
    padding: 1rem;
    margin-top: 1.2rem;
  }

  .selected-time {
    font-size: 0.9rem;
  }

  .book-btn {
    padding: 0.8rem 1rem;
    font-size: 1rem;
  }
}
</style>
