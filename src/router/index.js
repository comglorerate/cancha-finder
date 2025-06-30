import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CanchasList from "../views/CanchasList.vue";
import CanchaDetail from "../views/CanchaDetail.vue";
import ReservaConfirmacionView from "../views/ReservaConfirmacionView.vue";
import PerfilView from "../views/PerfilView.vue";
import AdminView from "../views/AdminView.vue";
import LoginView from "../views/LoginView.vue";
import { authStore } from "../data/auth";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/canchas",
    name: "canchas",
    component: CanchasList,
  },
  {
    path: "/canchas/:id",
    name: "canchaDetail",
    component: CanchaDetail,
  },
  {
    path: "/reserva/confirmacion/:canchaId",
    name: "reservaConfirmacion",
    component: ReservaConfirmacionView,
    meta: { requiresAuth: true },
  },
  {
    path: "/perfil",
    name: "perfil",
    component: PerfilView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    redirect: { path: "/login", query: { tab: "register" } },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ path: "/login", query: { redirect: to.fullPath } });
  } else if (to.meta.requiresAdmin && authStore.currentUser?.role !== "admin") {
    next("/");
  } else {
    next();
  }
});

export default router;
