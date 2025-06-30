import { reactive } from "vue";

export const canchas = [
  {
    id: 1,
    nombre: "Complejo Deportivo Madrid",
    tipo: "Fútbol",
    tamaño: "11 vs 11",
    superficie: "Césped natural",
    ubicacion: "Av. Principal 123, Madrid",
    precio: 80,
    imagen:
      "https://images.unsplash.com/photo-1540379708242-14a809bef941?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    descripcion:
      "Cancha de fútbol profesional con césped natural, iluminación nocturna y vestuarios completos.",
    horarios: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    calificacion: 4.5,
    reseñas: 28,
    servicios: ["Estacionamiento", "Vestuarios", "Iluminación", "Bar"],
  },
  {
    id: 2,
    nombre: "Centro Deportivo Barcelona",
    tipo: "Básquet",
    tamaño: "Estándar",
    superficie: "Parquet",
    ubicacion: "Calle Deportiva 456, Barcelona",
    precio: 50,
    imagen:
      "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/t_f-fs-0fv,q_auto:low,f_auto,c_fill,$w_280_mul_3,$h_180_mul_3/categories/92036/6319707",
    descripcion:
      "Cancha de básquet profesional con suelo de parquet, tableros de cristal y marcador electrónico.",
    horarios: ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"],
    calificacion: 4.7,
    reseñas: 35,
    servicios: ["Vestuarios", "Iluminación", "Cafetería", "Tienda deportiva"],
  },
  {
    id: 3,
    nombre: "Complejo Tenis Valencia",
    tipo: "Tenis",
    tamaño: "Individual/Dobles",
    superficie: "Arcilla",
    ubicacion: "Av. del Tenis 789, Valencia",
    precio: 40,
    imagen:
      "https://juvigo.es/assets/img/camp/1282/campamento-verano-idiomas-alicante-tenis.jpg",
    descripcion:
      "Cancha de tenis profesional de arcilla con mantenimiento diario y vestuarios de primer nivel.",
    horarios: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
    calificacion: 4.9,
    reseñas: 42,
    servicios: [
      "Estacionamiento",
      "Vestuarios",
      "Profesor",
      "Alquiler de raquetas",
    ],
  },
  {
    id: 4,
    nombre: "Polideportivo Sevilla",
    tipo: "Vóley",
    tamaño: "Estándar",
    superficie: "Sintético",
    ubicacion: "Calle del Deporte 321, Sevilla",
    precio: 35,
    imagen:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    descripcion:
      "Cancha de vóley profesional con red ajustable y suelo amortiguado para evitar lesiones.",
    horarios: ["10:00", "12:00", "14:00", "16:00", "18:00"],
    calificacion: 4.3,
    reseñas: 19,
    servicios: ["Vestuarios", "Iluminación", "Cafetería"],
  },
  {
    id: 5,
    nombre: "Complejo Deportivo Bilbao",
    tipo: "Fútbol",
    tamaño: "5 vs 5",
    superficie: "Césped artificial",
    ubicacion: "Plaza Deportiva 567, Bilbao",
    precio: 60,
    imagen:
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    descripcion:
      "Cancha de fútbol 5 con césped artificial de última generación y redes en perfecto estado.",
    horarios: ["11:00", "13:00", "15:00", "17:00", "19:00", "21:00"],
    calificacion: 4.6,
    reseñas: 31,
    servicios: ["Estacionamiento", "Vestuarios", "Iluminación", "Bar"],
  },
  {
    id: 6,
    nombre: "Polideportivo Municipal Málaga",
    tipo: "Básquet",
    tamaño: "Estándar",
    superficie: "Cemento",
    ubicacion: "Av. Municipal 890, Málaga",
    precio: 30,
    imagen:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    descripcion:
      "Cancha de básquet municipal con buen mantenimiento y accesible para todos los niveles.",
    horarios: ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"],
    calificacion: 4.2,
    reseñas: 24,
    servicios: ["Vestuarios", "Iluminación"],
  },
];

export const canchasStore = reactive({
  canchas,
  agregarCancha(cancha) {
    const newId = Math.max(...this.canchas.map((c) => c.id)) + 1;
    this.canchas.push({
      id: newId,
      nombre: cancha.nombre,
      ubicacion: cancha.ubicacion,
      tipo: cancha.deporte,
      precio: cancha.precioHora,
      estado: cancha.estado,
      descripcion: cancha.descripcion,
      imagen:
        cancha.imagen || "https://via.placeholder.com/400x300?text=Cancha",
      calificacion: 0,
      resenas: [],
      horarios: [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
      ],
    });
    return newId;
  },
  actualizarCancha(id, cancha) {
    const index = this.canchas.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.canchas[index] = {
        ...this.canchas[index],
        nombre: cancha.nombre,
        ubicacion: cancha.ubicacion,
        tipo: cancha.deporte,
        precio: cancha.precioHora,
        estado: cancha.estado,
        descripcion: cancha.descripcion,
        imagen: cancha.imagen,
      };
      return true;
    }
    return false;
  },
  eliminarCancha(id) {
    const index = this.canchas.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.canchas.splice(index, 1);
      return true;
    }
    return false;
  },
});

export const canchasArray = canchasStore.canchas;
