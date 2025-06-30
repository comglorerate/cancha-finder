<template>
  <header class="navbar">
    <div class="container navbar-container">
      <router-link to="/" class="logo">CanchaFinder.</router-link>

      <!-- Botón hamburguesa para móviles -->
      <button
        class="mobile-menu-button"
        @click="toggleMobileMenu"
        aria-label="Menú principal"
        :aria-expanded="mobileMenuOpen"
      >
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>

      <nav class="nav-items" :class="{ 'mobile-open': mobileMenuOpen }">
        <router-link to="/canchas" class="nav-link" active-class="active"
          >Canchas</router-link
        >
        <router-link
          v-if="isAuthenticated"
          to="/perfil"
          class="nav-link"
          active-class="active"
          >Perfil</router-link
        >
        <router-link
          v-if="isAdmin"
          to="/admin"
          class="nav-link"
          active-class="active"
          >Admin</router-link
        >

        <template v-if="isAuthenticated">
          <button @click="cerrarSesion" class="btn-logout">
            Cerrar Sesión
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link" active-class="active"
            >Iniciar Sesión</router-link
          >
          <router-link
            :to="{ path: '/login', query: { tab: 'register' } }"
            class="btn-register"
            >Registrarse</router-link
          >
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { authStore } from "../data/auth";
import { computed, ref } from "vue";

const router = useRouter();
const mobileMenuOpen = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.currentUser?.role === "admin");

const cerrarSesion = () => {
  authStore.logout();
  router.push("/");
  mobileMenuOpen.value = false;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>

<style scoped>
.navbar {
  background-color: var(--primary-color);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.logo {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
}

.nav-items {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
}

/* Estilo para link activo */
.nav-link.active {
  position: relative;
}

.nav-link.active::after {
  content: "";
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: white;
  border-radius: 1.5px;
}

.nav-link:hover {
  opacity: 0.8;
}

.btn-logout {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.btn-register {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
  display: inline-block;
  white-space: nowrap;
}

.btn-register:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

/* Menú móvil */
.mobile-menu-button {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 101;
}

.bar {
  width: 30px;
  height: 3px;
  background-color: white;
  border-radius: 3px;
  transition: all 0.3s ease;
}

/* Media queries para responsividad */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 1rem;
  }

  .mobile-menu-button {
    display: flex;
  }

  .nav-items {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 300px;
    height: 100vh;
    background-color: var(--primary-color);
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 4rem;
    padding-left: 2rem;
    padding-right: 2rem;
    transition: right 0.3s ease;
    z-index: 100;
    gap: 0.5rem;
  }

  .nav-items.mobile-open {
    right: 0;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  }

  .nav-link,
  .btn-register,
  .btn-logout {
    margin: 0.35rem 0;
    width: 100%;
    padding: 0.5rem 0;
    font-size: 1.1rem;
    text-align: left;
  }

  .nav-link.active {
    border-left: 3px solid white;
    padding-left: 0.5rem;
  }

  .nav-link.active::after {
    display: none;
  }

  .btn-logout {
    margin-top: 1rem;
  }
}

@media (max-width: 576px) {
  .logo {
    font-size: 1.25rem;
  }

  .navbar {
    padding: 0.75rem 0;
  }
}
</style>
