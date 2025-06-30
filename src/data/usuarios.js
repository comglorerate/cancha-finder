import { reactive } from "vue";

export const usuariosStore = reactive({
  usuario: {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan@example.com",
    telefono: "123-456-7890",
    ciudad: "Buenos Aires",
    fechaRegistro: new Date(2023, 0, 15),
    foto: "https://cdn-icons-png.flaticon.com/512/3004/3004592.png",
    favoritos: [1, 3],
  },

  toggleFavorito(canchaId) {
    const index = this.usuario.favoritos.indexOf(canchaId);
    if (index === -1) {
      this.usuario.favoritos.push(canchaId);
    } else {
      this.usuario.favoritos.splice(index, 1);
    }
  },

  esFavorito(canchaId) {
    return this.usuario.favoritos.includes(canchaId);
  },

  actualizarFoto(url) {
    this.usuario.foto = url;
  },

  actualizarInformacion(formData) {
    this.usuario.nombre = formData.nombre;
    this.usuario.apellido = formData.apellido;
    this.usuario.email = formData.email;
    this.usuario.telefono = formData.telefono;
    this.usuario.ciudad = formData.ciudad;
  },
});

export const usuario = usuariosStore.usuario;
