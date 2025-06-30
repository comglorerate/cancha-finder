<template>
  <div class="perfil-container">
    <h1 class="perfil-title">Mi Perfil</h1>

    <!-- Notificación de éxito -->
    <div
      v-if="notification.show"
      :class="['notification', notification.type]"
      role="alert"
    >
      <div class="notification-content">
        <font-awesome-icon
          :icon="notification.icon"
          class="notification-icon"
        />
        <p>{{ notification.message }}</p>
      </div>
      <button
        @click="hideNotification"
        class="notification-close"
        aria-label="Cerrar notificación"
      >
        <font-awesome-icon icon="times" />
      </button>
    </div>

    <!-- Rediseño de la tarjeta del perfil del usuario -->
    <div class="perfil-card user-profile">
      <div class="user-header">
        <div class="profile-image-container">
          <div class="profile-image">
            <img
              :src="
                usuariosStore.usuario.foto ||
                'https://cdn-icons-png.flaticon.com/512/3004/3004592.png'
              "
              alt="Foto de perfil"
              @error="handleImageError"
            />
            <button
              class="btn-cambiar-foto"
              @click="showAvatarSelector = true"
              aria-label="Cambiar foto de perfil"
            >
              <font-awesome-icon icon="camera" />
              <span>Cambiar</span>
            </button>
          </div>
        </div>
        <div class="profile-details">
          <div class="name-badge">
            <h2>
              {{ usuariosStore.usuario.nombre }}
              {{ usuariosStore.usuario.apellido }}
            </h2>
            <span class="user-status">En línea</span>
          </div>
          <div class="user-info-grid">
            <div class="info-item">
              <font-awesome-icon icon="envelope" class="info-icon" />
              <p>{{ usuariosStore.usuario.email }}</p>
            </div>
            <div class="info-item">
              <font-awesome-icon icon="map-marker-alt" class="info-icon" />
              <p>{{ usuariosStore.usuario.ciudad || "Sin ubicación" }}</p>
            </div>
            <div class="info-item">
              <font-awesome-icon icon="calendar" class="info-icon" />
              <p>
                Miembro desde:
                {{ formatDate(usuariosStore.usuario.fechaRegistro) }}
              </p>
            </div>
            <div class="info-item">
              <font-awesome-icon icon="phone" class="info-icon" />
              <p>{{ usuariosStore.usuario.telefono || "No disponible" }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de selección de avatar -->
    <div
      v-if="showAvatarSelector"
      class="avatar-modal-overlay"
      @click.self="showAvatarSelector = false"
      role="dialog"
      aria-labelledby="avatar-modal-title"
      aria-modal="true"
    >
      <div class="avatar-modal">
        <h3 id="avatar-modal-title">Elige una foto de perfil</h3>

        <div class="avatar-options">
          <div class="avatar-section">
            <h4>Avatares predefinidos</h4>
            <div class="avatar-grid">
              <div
                v-for="(avatar, index) in avatarOptions"
                :key="index"
                class="avatar-option"
                :class="{ selected: selectedAvatar === avatar }"
                @click="selectAvatar(avatar)"
              >
                <img :src="avatar" :alt="`Avatar ${index + 1}`" />
              </div>
            </div>
          </div>

          <div class="avatar-section">
            <h4>Subir una foto</h4>
            <div class="avatar-upload">
              <div class="preview-container">
                <img
                  v-if="previewImage"
                  :src="previewImage"
                  alt="Vista previa"
                  class="preview-image"
                />
                <div v-else class="no-preview">
                  <font-awesome-icon icon="image" />
                  <span>Vista previa</span>
                </div>
              </div>

              <label class="upload-btn">
                <font-awesome-icon icon="upload" />
                Seleccionar archivo
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="file-input"
                />
              </label>
            </div>
          </div>
        </div>

        <div class="avatar-actions">
          <button class="btn btn-outline" @click="showAvatarSelector = false">
            <font-awesome-icon icon="times" /> Cancelar
          </button>
          <button
            class="btn btn-primary"
            @click="saveAvatar"
            :disabled="!selectedAvatar && !previewImage"
          >
            <font-awesome-icon icon="check" /> Guardar cambios
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de edición de información personal -->
    <div v-if="showEditUserInfo" class="avatar-modal-overlay">
      <div class="avatar-modal user-info-modal">
        <div class="modal-header">
          <h3>Editar información personal</h3>
          <button class="close-btn" @click="showEditUserInfo = false">
            <font-awesome-icon icon="times" />
          </button>
        </div>

        <form @submit.prevent="saveUserInfo" class="user-info-form">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input
              id="nombre"
              v-model="editUserForm.nombre"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="form-group">
            <label for="apellido">Apellido</label>
            <input
              id="apellido"
              v-model="editUserForm.apellido"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="editUserForm.email"
              type="email"
              class="form-control"
              required
            />
          </div>

          <div class="form-group">
            <label for="telefono">Teléfono</label>
            <input
              id="telefono"
              v-model="editUserForm.telefono"
              type="tel"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="ciudad">Ciudad</label>
            <input
              id="ciudad"
              v-model="editUserForm.ciudad"
              type="text"
              class="form-control"
            />
          </div>

          <div class="avatar-actions">
            <button
              type="button"
              class="btn btn-outline"
              @click="showEditUserInfo = false"
            >
              <font-awesome-icon icon="times" /> Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              <font-awesome-icon icon="check" /> Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Sección de Próximas Reservas mejorada -->
    <div class="perfil-card">
      <h3 class="section-title">
        <font-awesome-icon icon="calendar-alt" class="section-icon" />
        Próximas Reservas
      </h3>

      <div v-if="reservasProximas.length" class="reservas-list">
        <div
          v-for="reserva in reservasProximas"
          :key="reserva.id"
          class="reserva-item"
        >
          <div class="reserva-fecha">
            <div class="fecha-box">
              <span class="fecha-dia">{{ getDayNumber(reserva.fecha) }}</span>
              <span class="fecha-mes">{{ getMonthName(reserva.fecha) }}</span>
            </div>
            <span class="fecha-hora">{{ reserva.horaInicio }}</span>
          </div>

          <div class="reserva-info">
            <div class="reserva-header">
              <h4>{{ reserva.nombreCancha }}</h4>
              <span class="reserva-estado" :class="reserva.estado">
                {{ reserva.estado }}
              </span>
            </div>
            <div class="reserva-details">
              <p>
                <font-awesome-icon icon="clock" />
                <span>{{ reserva.horaInicio }} - {{ reserva.horaFin }}</span>
              </p>
              <p>
                <font-awesome-icon icon="futbol" />
                <span>{{ getDeporteCancha(reserva.canchaId) }}</span>
              </p>
              <p v-if="reserva.precio">
                <font-awesome-icon icon="dollar-sign" />
                <span>${{ reserva.precio }}</span>
              </p>
            </div>
          </div>

          <div class="reserva-actions">
            <router-link
              :to="`/canchas/${reserva.canchaId}`"
              class="btn btn-primary"
            >
              <font-awesome-icon icon="eye" /> Ver detalle
            </router-link>
            <button
              class="btn btn-outline cancel-btn"
              @click="cancelarReserva(reserva.id)"
            >
              <font-awesome-icon icon="ban" /> Cancelar reserva
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-list">
        <div class="empty-icon">
          <font-awesome-icon icon="calendar-times" />
        </div>
        <p>No tienes reservas próximas</p>
        <router-link to="/canchas" class="btn btn-primary">
          <font-awesome-icon icon="search" /> Buscar canchas
          <font-awesome-icon icon="arrow-right" class="arrow-icon" />
        </router-link>
      </div>
    </div>

    <div class="perfil-card">
      <h3 class="section-title">
        <font-awesome-icon icon="history" class="section-icon" />
        Historial de Reservas
      </h3>

      <div v-if="historialReservas.length" class="reservas-list historial-list">
        <div
          v-for="reserva in historialReservas"
          :key="reserva.id"
          class="reserva-item historial-item"
        >
          <div class="reserva-fecha">
            <div class="fecha-box historial-fecha">
              <span class="fecha-dia">{{ getDayNumber(reserva.fecha) }}</span>
              <span class="fecha-mes">{{ getMonthName(reserva.fecha) }}</span>
            </div>
          </div>

          <div class="reserva-info">
            <div class="reserva-header">
              <h4>{{ reserva.nombreCancha }}</h4>
              <span
                class="reserva-estado historial-estado"
                :class="reserva.estado"
              >
                {{ reserva.estado }}
              </span>
            </div>

            <div class="reserva-details">
              <p>
                <font-awesome-icon icon="clock" />
                <span
                  >{{ reserva.horaInicio || "N/A" }} -
                  {{ reserva.horaFin || "N/A" }}</span
                >
              </p>
              <p>
                <font-awesome-icon icon="futbol" />
                <span>{{ getDeporteCancha(reserva.canchaId) }}</span>
              </p>
            </div>
          </div>

          <div class="reserva-actions">
            <router-link
              :to="`/canchas/${reserva.canchaId}`"
              class="btn btn-primary"
            >
              <font-awesome-icon icon="search" /> Ver cancha
            </router-link>
          </div>
        </div>
      </div>

      <div v-else class="empty-list">
        <div class="empty-icon">
          <font-awesome-icon icon="history" />
        </div>
        <p>No tienes historial de reservas</p>
      </div>
    </div>

    <div class="perfil-card">
      <h3 class="section-title">
        <font-awesome-icon icon="heart" class="section-icon" />
        Mis Canchas Favoritas
      </h3>
      <div v-if="canchasFavoritas.length" class="favoritas-list">
        <div
          v-for="cancha in canchasFavoritas"
          :key="cancha.id"
          class="cancha-item"
        >
          <div class="cancha-imagen">
            <img
              :src="cancha.imagen"
              :alt="`Imagen de ${cancha.nombre}`"
              @error="handleImageError"
            />
            <span class="cancha-tipo">{{ cancha.tipo }}</span>
          </div>
          <div class="cancha-info">
            <div class="cancha-header">
              <h4>{{ cancha.nombre }}</h4>
            </div>
            <div class="cancha-details">
              <p>
                <font-awesome-icon icon="map-marker-alt" />
                <span>{{ cancha.ubicacion }}</span>
              </p>
              <p v-if="cancha.horario">
                <font-awesome-icon icon="clock" />
                <span>{{ cancha.horario }}</span>
              </p>
            </div>
          </div>
          <div class="cancha-actions">
            <router-link :to="`/canchas/${cancha.id}`" class="btn btn-primary">
              <font-awesome-icon icon="calendar-check" /> Reservar
            </router-link>
            <button
              class="btn btn-outline cancel-btn"
              @click="quitarFavorito(cancha.id)"
              title="Quitar de favoritos"
            >
              <font-awesome-icon icon="heart-broken" /> Quitar favorito
            </button>
          </div>
        </div>
      </div>
      <div v-else class="empty-list">
        <div class="empty-icon">
          <font-awesome-icon icon="heart" />
        </div>
        <p>No tienes canchas favoritas</p>
        <router-link to="/canchas" class="btn btn-primary">
          <font-awesome-icon icon="search" /> Explorar canchas
        </router-link>
      </div>
    </div>

    <div class="perfil-card">
      <h3 class="section-title">
        <font-awesome-icon icon="cog" class="section-icon" />
        Configuración de la cuenta
      </h3>
      <div class="config-options">
        <button
          @click="editUserInformation"
          class="btn btn-outline config-item"
        >
          <font-awesome-icon icon="user-edit" />
          <span> Editar información personal</span>
        </button>
        <router-link to="/perfil/password" class="btn btn-outline config-item">
          <font-awesome-icon icon="key" />
          <span> Cambiar contraseña</span>
        </router-link>
        <router-link to="/perfil/pagos" class="btn btn-outline config-item">
          <font-awesome-icon icon="credit-card" />
          <span> Métodos de pago</span>
        </router-link>
        <router-link
          to="/perfil/notificaciones"
          class="btn btn-outline config-item"
        >
          <font-awesome-icon icon="bell" />
          <span> Notificaciones</span>
        </router-link>
      </div>
    </div>

    <!-- Overlay de carga -->
    <div
      v-if="isLoading"
      class="loading-overlay"
      role="status"
      aria-live="polite"
    >
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from "vue";
import { reservasStore } from "../data/reservas";
import { canchasStore } from "../data/canchas";
import { usuariosStore } from "../data/usuarios";

const estadisticas = reactive({
  reservas: 0,
  deportes: [],
  reservasActivas: 0,
});

const showAvatarSelector = ref(false);
const selectedAvatar = ref("");
const previewImage = ref("");

const showEditUserInfo = ref(false);
const editUserForm = reactive({
  nombre: usuariosStore.usuario.nombre,
  apellido: usuariosStore.usuario.apellido,
  email: usuariosStore.usuario.email,
  telefono: usuariosStore.usuario.telefono || "",
  ciudad: usuariosStore.usuario.ciudad || "",
});

const avatarOptions = [
  "https://cdn-icons-png.flaticon.com/512/2158/2158476.png",
  "https://cdn-icons-png.flaticon.com/512/2158/2158416.png",
  "https://cdn-icons-png.flaticon.com/512/3074/3074047.png",
  "https://cdn-icons-png.flaticon.com/512/857/857455.png",
  "https://cdn-icons-png.flaticon.com/512/3004/3004592.png",
  "https://cdn-icons-png.flaticon.com/512/3043/3043596.png",
  "https://cdn-icons-png.flaticon.com/512/2158/2158440.png",
  "https://cdn-icons-png.flaticon.com/512/2158/2158464.png",
];

const selectAvatar = (avatar) => {
  selectedAvatar.value = avatar;
  previewImage.value = "";
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedAvatar.value = "";
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const isLoading = ref(false);

const notification = reactive({
  show: false,
  message: "",
  type: "success",
  icon: "check-circle",
  timeout: null,
});

const showNotification = (message, type = "success") => {
  if (notification.timeout) {
    clearTimeout(notification.timeout);
  }

  notification.show = true;
  notification.message = message;
  notification.type = type;
  notification.icon = type === "success" ? "check-circle" : "exclamation-circle";

  notification.timeout = setTimeout(() => {
    notification.show = false;
  }, 5000);
};

const hideNotification = () => {
  notification.show = false;
  if (notification.timeout) {
    clearTimeout(notification.timeout);
  }
};

const validateUserForm = () => {
  const errors = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(editUserForm.email)) {
    errors.push("El formato del email no es válido");
  }

  if (!editUserForm.nombre.trim()) errors.push("El nombre es obligatorio");
  if (!editUserForm.apellido.trim()) errors.push("El apellido es obligatorio");

  if (
    editUserForm.telefono &&
    !/^\d{9,}$/.test(editUserForm.telefono.replace(/\D/g, ""))
  ) {
    errors.push("El formato del teléfono no es válido");
  }

  return errors;
};

const handleImageError = (event) => {
  event.target.src = "https://cdn-icons-png.flaticon.com/512/3004/3004592.png";
};

const saveUserInfo = async () => {
  const errors = validateUserForm();
  if (errors.length) {
    showNotification(errors[0], "error");
    return;
  }

  try {
    isLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 500));

    usuariosStore.usuario.nombre = editUserForm.nombre;
    usuariosStore.usuario.apellido = editUserForm.apellido;
    usuariosStore.usuario.email = editUserForm.email;
    usuariosStore.usuario.telefono = editUserForm.telefono;
    usuariosStore.usuario.ciudad = editUserForm.ciudad;

    showNotification("Información actualizada correctamente");
    showEditUserInfo.value = false;
  } catch (error) {
    console.error("Error al actualizar información:", error);
    showNotification("Ocurrió un error al actualizar la información", "error");
  } finally {
    isLoading.value = false;
  }
};

const saveAvatar = async () => {
  let newAvatar = selectedAvatar.value || previewImage.value;
  if (newAvatar) {
    try {
      isLoading.value = true;
      await new Promise((resolve) => setTimeout(resolve, 500));

      usuariosStore.actualizarFoto(newAvatar);
      showAvatarSelector.value = false;
      showNotification("Foto de perfil actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar foto:", error);
      showNotification("Ocurrió un error al actualizar la foto", "error");
    } finally {
      isLoading.value = false;
    }
  }
};

const calcularEstadisticas = () => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const userReservas = reservasStore.reservas.filter(
    (r) =>
      r.nombreCliente ===
      usuariosStore.usuario.nombre + " " + usuariosStore.usuario.apellido
  );

  estadisticas.reservas = userReservas.length;

  estadisticas.reservasActivas = userReservas.filter((r) => {
    const reservaDate = new Date(r.fecha);
    reservaDate.setHours(0, 0, 0, 0);
    return (
      reservaDate >= hoy && ["confirmada", "pendiente"].includes(r.estado)
    );
  }).length;

  const deportesSet = new Set();
  userReservas.forEach((r) => {
    const cancha = canchasStore.canchas.find((c) => c.id === r.canchaId);
    if (cancha) {
      deportesSet.add(cancha.tipo);
    }
  });
  estadisticas.deportes = [...deportesSet];
};

const getDeporteCancha = (canchaId) => {
  const cancha = canchasStore.canchas.find((c) => c.id === canchaId);
  return cancha ? cancha.tipo : "Desconocido";
};

const cancelarReserva = async (id) => {
  if (confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
    try {
      isLoading.value = true;
      await new Promise((resolve) => setTimeout(resolve, 500));

      reservasStore.actualizarReserva(id, { estado: "cancelada" });
      calcularEstadisticas();
      showNotification("Reserva cancelada correctamente");
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      showNotification("Ocurrió un error al cancelar la reserva", "error");
    } finally {
      isLoading.value = false;
    }
  }
};

const quitarFavorito = (canchaId) => {
  usuariosStore.toggleFavorito(canchaId);
  showNotification("Se ha actualizado tu lista de favoritos");
};

const getDayNumber = (date) => {
  return new Date(date).getDate();
};

const getMonthName = (date) => {
  const months = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun", 
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ];
  return months[new Date(date).getMonth()];
};

const editUserInformation = () => {
  editUserForm.nombre = usuariosStore.usuario.nombre;
  editUserForm.apellido = usuariosStore.usuario.apellido;
  editUserForm.email = usuariosStore.usuario.email;
  editUserForm.telefono = usuariosStore.usuario.telefono || "";
  editUserForm.ciudad = usuariosStore.usuario.ciudad || "";

  showEditUserInfo.value = true;
};

const reservasProximas = computed(() => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  return reservasStore.reservas
    .filter((r) => {
      const reservaDate = new Date(r.fecha);
      reservaDate.setHours(0, 0, 0, 0);
      return (
        reservaDate >= hoy &&
        r.nombreCliente ===
          usuariosStore.usuario.nombre + " " + usuariosStore.usuario.apellido &&
        ["confirmada", "pendiente"].includes(r.estado)
      );
    })
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
});

const historialReservas = computed(() => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  return reservasStore.reservas
    .filter((r) => {
      const reservaDate = new Date(r.fecha);
      reservaDate.setHours(0, 0, 0, 0);
      return (
        (reservaDate < hoy || ["cancelada", "completada"].includes(r.estado)) &&
        r.nombreCliente ===
          usuariosStore.usuario.nombre + " " + usuariosStore.usuario.apellido
      );
    })
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

const canchasFavoritas = computed(() => {
  return canchasStore.canchas.filter((c) =>
    usuariosStore.usuario.favoritos.includes(c.id)
  );
});

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-ES");
};

onMounted(() => {
  calcularEstadisticas();
});
</script>

<style scoped>
/* Estilos básicos del perfil */
.perfil-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.perfil-title {
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
  text-align: center;
}

.perfil-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  padding: 25px;
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

.user-profile {
  border-top: 4px solid var(--primary-color);
}

/* Sección de perfil de usuario */
.user-header {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 25px;
  align-items: center;
}

.profile-image-container {
  position: relative;
}

.profile-image {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--primary-color);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.profile-image:hover img {
  filter: brightness(0.7);
}

.btn-cambiar-foto {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.profile-image:hover .btn-cambiar-foto {
  opacity: 1;
}

.profile-details {
  flex: 1;
  min-width: 280px;
}

.name-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.name-badge h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}

.user-status {
  background-color: #4caf50;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.user-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-icon {
  color: var(--primary-color);
  font-size: 1rem;
  width: 20px;
}

.info-item p {
  margin: 0;
  color: #555;
}

/* Sección de título */
.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;
  color: #333;
  font-size: 1.4rem;
}

.section-icon {
  color: var(--primary-color);
}
.config-options {
  display: flex;
  gap: 15px;
}
/* Estilos de modal (avatar y edición) */
.avatar-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.avatar-modal {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.avatar-modal h3 {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

/* Selector de avatar */
.avatar-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 25px;
}

.avatar-section h4 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1rem;
  color: #555;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 15px;
}

.avatar-option {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 3px solid transparent;
}

.avatar-option:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.avatar-option.selected {
  border-color: var(--primary-color);
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.preview-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px dashed #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.no-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #aaa;
  gap: 5px;
}

.no-preview svg {
  font-size: 2rem;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #f0f0f0;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.upload-btn:hover {
  background-color: #e0e0e0;
}

.file-input {
  display: none;
}

/* Botones y acciones */
.avatar-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 25px;
}

.cancel-btn {
  color: var(--text-color);
  border-color: var(--text-color);
}

.cancel-btn:hover {
  background-color: var(--text-color);
  color: #d32f2f;
  border-color: #d32f2f;
}

/* Modal de edición */
.user-info-modal {
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

/* Formulario de edición */
.user-info-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  color: #555;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-control {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(42, 157, 143, 0.2);
}

/* Reservas y lista vacía */
.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.empty-icon {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 15px;
}

.arrow-icon {
  margin-left: 5px;
  transition: transform 0.3s ease;
}

a:hover .arrow-icon {
  transform: translateX(5px);
}

/* Estilos de reservas */
.reservas-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.reserva-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  position: relative;
  border: 1px solid #eee;
  transition: all 0.3s ease;
}

.reserva-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.07);
  transform: translateY(-2px);
}

.reserva-fecha {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.fecha-box {
  background-color: var(--primary-color);
  color: white;
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
}

.fecha-dia {
  font-size: 1.8rem;
  font-weight: 700;
  padding: 5px 0;
}

.fecha-mes {
  font-size: 0.8rem;
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%;
  text-align: center;
  padding: 2px 0;
  text-transform: uppercase;
}

.fecha-hora {
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
}

.reserva-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.reserva-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 150px;
}

.reserva-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reserva-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #222;
}

.reserva-estado {
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

.reserva-estado.confirmada {
  background-color: #e8f5e9;
  color: #2e7d32;
}

/* Historial de reservas */
.historial-fecha {
  background-color: #9e9e9e;
}

/* Estados de reservas faltantes */
.reserva-estado.pendiente {
  background-color: #fff8e1;
  color: #f57f17;
}

.reserva-estado.cancelada {
  background-color: #ffebee;
  color: #c62828;
}

.reserva-estado.completada {
  background-color: #e1f5fe;
  color: #0288d1;
}

/* Historial estado */
.historial-estado.completada {
  background-color: #e1f5fe;
  color: #0288d1;
}

.historial-estado.cancelada {
  background-color: #ffebee;
  color: #c62828;
}

/* Estilos para notificaciones */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1100;
  max-width: 400px;
  animation: slideIn 0.3s ease;
}

.notification.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border-left: 4px solid #2e7d32;
}

.notification.error {
  background-color: #ffebee;
  color: #c62828;
  border-left: 4px solid #c62828;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.notification-icon {
  font-size: 1.2rem;
}

.notification-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.7;
  padding: 4px;
  transition: opacity 0.2s ease;
}

.notification-close:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Overlay de carga */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
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

/* Arreglo para iconos en detalles de reservas */
.reserva-details p {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #555;
  font-size: 0.9rem;
  margin: 0.3rem 0;
}

/* Estilos para canchas favoritas */
.favoritas-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cancha-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  position: relative;
  border: 1px solid #eee;
  transition: all 0.3s ease;
}

.cancha-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.07);
  transform: translateY(-2px);
}

.cancha-imagen {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.cancha-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cancha-tipo {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.8rem;
  text-align: center;
  padding: 4px 0;
}

.cancha-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.cancha-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.cancha-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #222;
}

.cancha-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cancha-details p {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 7px;
  color: #555;
  font-size: 0.9rem;
}

.cancha-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 150px;
}

/* Mejoras en responsividad */
@media (max-width: 992px) {
  .user-header {
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .user-header {
    flex-direction: column;
    align-items: center;
  }

  .profile-details {
    text-align: center;
  }

  .name-badge {
    flex-direction: column;
    align-items: center;
  }

  .user-info-grid {
    grid-template-columns: 1fr;
  }

  .config-options {
    flex-direction: column;
  }

  .config-item {
    width: 100%;
    flex: none;
    margin-bottom: 10px;
  }

  .avatar-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }

  .notification {
    width: 90%;
    max-width: none;
    right: 5%;
    left: 5%;
  }
}

@media (max-width: 576px) {
  .cancha-item,
  .reserva-item {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .cancha-imagen {
    width: 100%;
    height: 180px;
  }

  .cancha-actions,
  .reserva-actions {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }

  .btn,
  .cancha-actions .btn-primary,
  .cancha-actions .cancel-btn,
  .reserva-actions .btn-primary,
  .reserva-actions .cancel-btn {
    flex: 1;
    white-space: nowrap;
    font-size: 0.9rem;
    padding: 0.5rem;
  }

  .reserva-fecha {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .fecha-box {
    width: 50px;
  }

  .fecha-dia {
    font-size: 1.5rem;
  }
}

@media (max-width: 430px) {
  .perfil-container {
    padding: 10px;
  }

  .perfil-card {
    padding: 15px;
    margin-bottom: 15px;
  }

  .perfil-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .name-badge h2 {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .avatar-modal {
    padding: 15px;
    width: 95%;
  }

  .cancha-actions,
  .reserva-actions {
    flex-direction: column;
  }

  .reserva-estado,
  .historial-estado {
    font-size: 0.75rem;
    padding: 2px 8px;
  }
}
</style>
