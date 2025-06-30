import { reactive } from "vue";
import { usuariosStore } from "./usuarios";

const usersDB = [
  {
    id: 1,
    email: "admin@example.com",
    password: "admin123",
    nombre: "Admin",
    apellido: "Usuario",
    role: "admin",
  },
  {
    id: 2,
    email: "usuario@example.com",
    password: "user123",
    nombre: "Juan",
    apellido: "Pérez",
    role: "user",
  },
];

export const authStore = reactive({
  isAuthenticated: !!localStorage.getItem("auth-token"),
  currentUser: JSON.parse(localStorage.getItem("auth-user")) || null,

  login(email, password) {
    const user = usersDB.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      this.isAuthenticated = true;
      this.currentUser = {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        role: user.role,
      };

      localStorage.setItem("auth-token", "dummy-jwt-token");
      localStorage.setItem("auth-user", JSON.stringify(this.currentUser));

      if (user.id === usuariosStore.usuario.id) {
        usuariosStore.usuario.email = user.email;
        usuariosStore.usuario.nombre = user.nombre;
        usuariosStore.usuario.apellido = user.apellido;
      }

      return true;
    }

    return false;
  },

  register(userData) {
    if (usersDB.some((user) => user.email === userData.email)) {
      return false;
    }

    const newId = Math.max(...usersDB.map((user) => user.id)) + 1;

    usersDB.push({
      id: newId,
      email: userData.email,
      password: userData.password,
      nombre: userData.nombre,
      apellido: userData.apellido,
      role: "user",
    });

    return this.login(userData.email, userData.password);
  },

  logout() {
    this.isAuthenticated = false;
    this.currentUser = null;
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
  },
});
