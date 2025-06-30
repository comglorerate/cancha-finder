<template>
  <div class="canchas-list">
    <div class="container">
      <h1 class="page-title">
        Explorar <span class="gradient-text">Canchas.</span>
      </h1>

      <!-- Filtros -->
      <div class="filters">
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar por nombre o ubicación..."
            class="search-input"
            aria-label="Buscar canchas"
          />
          <button class="search-button" aria-label="Buscar">
            <font-awesome-icon icon="search" />
          </button>
        </div>

        <div class="filter-selects">
          <v-select
            v-model="tipoFilter"
            :options="tipoOptions"
            placeholder="Todos los deportes"
            :clearable="false"
            class="filter-select"
            aria-label="Filtrar por deporte"
          ></v-select>

          <v-select
            v-model="precioFilter"
            :options="precioOptions"
            placeholder="Todos los precios"
            :clearable="false"
            class="filter-select"
            aria-label="Filtrar por precio"
          ></v-select>

          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="clear-filters-btn"
            aria-label="Limpiar todos los filtros"
          >
            <font-awesome-icon icon="times" /> Limpiar filtros
          </button>
        </div>
      </div>

      <!-- Indicador de filtros activos -->
      <div v-if="hasActiveFilters" class="active-filters">
        <span>Filtros activos:</span>
        <div class="filter-tags">
          <div v-if="searchQuery" class="filter-tag">
            Búsqueda: {{ searchQuery }}
            <button
              @click="searchQuery = ''"
              class="remove-filter"
              aria-label="Quitar filtro de búsqueda"
            >
              <font-awesome-icon icon="times" />
            </button>
          </div>
          <div
            v-if="
              typeof tipoFilter === 'object' ? tipoFilter?.value : tipoFilter
            "
            class="filter-tag"
          >
            Deporte: {{ getFilterLabel(tipoFilter, tipoOptions) }}
            <button
              @click="tipoFilter = null"
              class="remove-filter"
              aria-label="Quitar filtro de deporte"
            >
              <font-awesome-icon icon="times" />
            </button>
          </div>
          <div
            v-if="
              typeof precioFilter === 'object'
                ? precioFilter?.value
                : precioFilter
            "
            class="filter-tag"
          >
            Precio: {{ getFilterLabel(precioFilter, precioOptions) }}
            <button
              @click="precioFilter = null"
              class="remove-filter"
              aria-label="Quitar filtro de precio"
            >
              <font-awesome-icon icon="times" />
            </button>
          </div>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="isLoading" class="loading-state">
        <div
          class="loading-spinner"
          role="status"
          aria-label="Cargando canchas"
        ></div>
      </div>

      <!-- Lista de canchas -->
      <div v-else class="canchas-grid">
        <div
          v-for="cancha in filteredCanchas"
          :key="cancha.id"
          class="cancha-card"
          @click="verDetalle(cancha.id)"
          tabindex="0"
          @keydown.enter="verDetalle(cancha.id)"
          role="article"
          :aria-labelledby="`cancha-${cancha.id}-name`"
        >
          <div
            class="cancha-image"
            :style="{ backgroundImage: `url(${cancha.imagen})` }"
            @error="handleImageError($event, cancha)"
          >
            <div class="cancha-price">{{ cancha.precio }}€/h</div>
          </div>
          <div class="cancha-info">
            <h3 :id="`cancha-${cancha.id}-name`" class="cancha-name">
              {{ cancha.nombre }}
            </h3>
            <div class="cancha-type">
              <span class="cancha-badge">{{ cancha.tipo }}</span>
              <span class="cancha-badge">{{ cancha.superficie }}</span>
            </div>
            <div class="cancha-location">
              <font-awesome-icon icon="map-marker-alt" />
              <span>{{ cancha.ubicacion }}</span>
            </div>
            <div
              class="cancha-rating"
              :aria-label="`Valoración: ${cancha.calificacion} de 5 estrellas`"
            >
              <span
                class="stars"
                v-html="showStars(cancha.calificacion)"
              ></span>
              <span class="reviews">({{ cancha.reseñas }})</span>
            </div>
          </div>
          <button class="btn btn-primary see-details-btn">Ver detalles</button>
        </div>
      </div>

      <!-- Mensaje si no hay resultados -->
      <div v-if="!isLoading && filteredCanchas.length === 0" class="no-results">
        <p>No hay canchas que coincidan con los filtros seleccionados.</p>
        <button @click="clearFilters" class="btn btn-primary">
          Limpiar filtros
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { canchas } from "../data/canchas";

// Router
const router = useRouter();
const route = useRoute();

// Opciones para los selects
const tipoOptions = [
  { label: "Todos los deportes", value: null },
  { label: "Fútbol", value: "Fútbol" },
  { label: "Básquet", value: "Básquet" },
  { label: "Tenis", value: "Tenis" },
  { label: "Vóley", value: "Vóley" },
];

const precioOptions = [
  { label: "Todos los precios", value: null },
  { label: "Económico (< 40€)", value: "barato" },
  { label: "Precio medio (40€ - 60€)", value: "medio" },
  { label: "Premium (> 60€)", value: "caro" },
];

// Estado
const searchQuery = ref("");
const tipoFilter = ref(tipoOptions[0]); // Inicializar con "Todos los deportes"
const precioFilter = ref(precioOptions[0]); // Inicializar con "Todos los precios"
const isLoading = ref(true);

// Computed properties
const filteredCanchas = computed(() => {
  return canchas.filter((cancha) => {
    // Filtrar por búsqueda
    const searchMatch =
      searchQuery.value === "" ||
      cancha.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      cancha.ubicacion.toLowerCase().includes(searchQuery.value.toLowerCase());

    // Filtrar por tipo - manejar tanto string como objeto
    const tipoValue =
      typeof tipoFilter.value === "object"
        ? tipoFilter.value?.value
        : tipoFilter.value;
    const tipoMatch =
      !tipoValue || tipoValue === null || cancha.tipo === tipoValue;

    // Filtrar por precio - manejar tanto string como objeto
    const precioValue =
      typeof precioFilter.value === "object"
        ? precioFilter.value?.value
        : precioFilter.value;
    let precioMatch = true;
    if (precioValue === "barato") {
      precioMatch = cancha.precio < 40;
    } else if (precioValue === "medio") {
      precioMatch = cancha.precio >= 40 && cancha.precio <= 60;
    } else if (precioValue === "caro") {
      precioMatch = cancha.precio > 60;
    }

    return searchMatch && tipoMatch && precioMatch;
  });
});

// Verificar si hay filtros activos
const hasActiveFilters = computed(() => {
  const tipoValue =
    typeof tipoFilter.value === "object"
      ? tipoFilter.value?.value
      : tipoFilter.value;
  const precioValue =
    typeof precioFilter.value === "object"
      ? precioFilter.value?.value
      : precioFilter.value;

  return (
    searchQuery.value !== "" ||
    (tipoValue !== null && tipoValue !== undefined) ||
    (precioValue !== null && precioValue !== undefined)
  );
});

// Actualizar URL cuando cambien los filtros
watch([searchQuery, tipoFilter, precioFilter], () => {
  const query = {};
  if (searchQuery.value) query.busqueda = searchQuery.value;

  const tipoValue =
    typeof tipoFilter.value === "object"
      ? tipoFilter.value?.value
      : tipoFilter.value;
  if (tipoValue) query.deporte = tipoValue;

  const precioValue =
    typeof precioFilter.value === "object"
      ? precioFilter.value?.value
      : precioFilter.value;
  if (precioValue) query.precio = precioValue;

  router.replace({ query });
});

// Inicializar los filtros basados en los parámetros de URL
onMounted(() => {
  // Si hay un parámetro 'deporte' en la URL, aplicar el filtro
  if (route.query.deporte) {
    // Buscar el valor correspondiente en las opciones
    const deporteOption = tipoOptions.find(
      (option) =>
        option.label === route.query.deporte ||
        option.value === route.query.deporte
    );
    if (deporteOption && deporteOption.value !== null) {
      tipoFilter.value = deporteOption;
    }
  }

  // Si hay un parámetro de búsqueda, aplicarlo
  if (route.query.busqueda) {
    searchQuery.value = route.query.busqueda;
  }

  // Si hay un parámetro de precio, aplicarlo
  if (route.query.precio) {
    const precioOption = precioOptions.find(
      (option) => option.value === route.query.precio
    );
    if (precioOption && precioOption.value !== null) {
      precioFilter.value = precioOption;
    }
  }

  // Simular tiempo de carga
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});

// Métodos
const verDetalle = (id) => {
  router.push({ name: "canchaDetail", params: { id } });
};

const showStars = (rating) => {
  const starFull = '<span class="star full">★</span>';
  const starHalf = '<span class="star half">★</span>';
  const starEmpty = '<span class="star empty">★</span>';

  let stars = "";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Agregar estrellas llenas
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

// Obtener etiqueta legible para los filtros
const getFilterLabel = (value, options) => {
  // Si el valor es un objeto, extraer el value
  const actualValue = typeof value === "object" ? value?.value : value;
  const option = options.find((opt) => opt.value === actualValue);
  return option ? option.label : actualValue;
};

// Limpiar todos los filtros
const clearFilters = () => {
  searchQuery.value = "";
  tipoFilter.value = tipoOptions[0]; // "Todos los deportes"
  precioFilter.value = precioOptions[0]; // "Todos los precios"
};

// Manejar errores de imagen
const handleImageError = (event, cancha) => {
  // Para imágenes de fondo no podemos usar @error directamente,
  // esto es para la documentación del problema
  console.error(`Error cargando imagen para cancha: ${cancha.id}`);
};
</script>

<style scoped>
.canchas-list {
  padding: 3rem 0;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.filters {
  margin-bottom: 2.5rem;
}

.search-container {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1.5rem;
  border-radius: 2rem;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  box-sizing: border-box;
}

.search-button {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  color: #64748b;
  font-size: 1rem;
}

.filter-selects {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select {
  flex: 1;
  min-width: 120px; /* Reducir el min-width original de 200px */
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  background-color: white;
  box-sizing: border-box;
}

.canchas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.cancha-card {
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.cancha-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.cancha-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.cancha-price {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.cancha-info {
  padding: 1.5rem;
}

.cancha-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.cancha-type {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.cancha-badge {
  background-color: rgba(20, 184, 166, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.cancha-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #64748b;
  font-size: 0.9rem;
}

.cancha-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  display: flex;
  align-items: center;
}

.star {
  font-size: 0.9rem;
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
  font-size: 0.8rem;
  color: #64748b;
}

.see-details-btn {
  width: 100%;
  padding: 1rem;
  border-radius: 0;
  font-size: 1rem;
  text-align: center;
}

.no-results {
  text-align: center;
  padding: 3rem 0;
  color: #64748b;
}

/* Filtros activos */
.active-filters {
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  display: flex;
  align-items: center;
  background-color: rgba(20, 184, 166, 0.1);
  border-radius: 2rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  color: var(--primary-color);
  gap: 0.5rem;
}

.remove-filter {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-filters-btn {
  padding: 0.5rem 1rem;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.clear-filters-btn:hover {
  background-color: #e2e8f0;
}

/* Estado de carga */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(20, 184, 166, 0.2);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spinner 0.8s linear infinite;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Media Queries */
@media (max-width: 992px) {
  .canchas-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .filter-selects {
    flex-direction: column;
    gap: 0.75rem;
  }

  .filter-select {
    width: 100%;
  }

  .search-input {
    padding: 0.8rem 2.5rem 0.8rem 1.2rem;
  }
}

@media (max-width: 576px) {
  .canchas-list {
    padding: 2rem 0;
  }

  .page-title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .canchas-grid {
    grid-template-columns: 1fr;
  }

  .cancha-name {
    font-size: 1.1rem;
  }

  .cancha-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }

  .cancha-location {
    font-size: 0.8rem;
  }
}

@media (max-width: 430px) {
  .canchas-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .filters {
    margin-bottom: 1rem;
  }

  .filter-tag {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }

  .active-filters {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
