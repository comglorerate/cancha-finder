import { reactive } from "vue";

const reservasIniciales = [
  {
    id: 1,
    nombreCliente: "Juan Pérez",
    nombreCancha: "Cancha El Gol",
    canchaId: 1,
    fecha: new Date(2023, 10, 15),
    horaInicio: "19:00",
    horaFin: "20:00",
    estado: "confirmada",
    precio: 1500,
  },
  {
    id: 2,
    nombreCliente: "María López",
    nombreCancha: "Club Deportivo Central",
    canchaId: 2,
    fecha: new Date(2023, 10, 16),
    horaInicio: "18:00",
    horaFin: "19:30",
    estado: "pendiente",
    precio: 2700,
  },
  {
    id: 3,
    nombreCliente: "Carlos Gómez",
    nombreCancha: "Complejo Polideportivo",
    canchaId: 3,
    fecha: new Date(2023, 10, 14),
    horaInicio: "10:00",
    horaFin: "12:00",
    estado: "cancelada",
    precio: 2400,
  },
  {
    id: 4,
    nombreCliente: "Laura Martínez",
    nombreCancha: "Cancha El Gol",
    canchaId: 1,
    fecha: new Date(2023, 10, 13),
    horaInicio: "16:00",
    horaFin: "17:00",
    estado: "completada",
    precio: 1500,
  },
  {
    id: 5,
    nombreCliente: "Roberto Sánchez",
    nombreCancha: "Club del Lago",
    canchaId: 4,
    fecha: new Date(2023, 10, 17),
    horaInicio: "20:00",
    horaFin: "22:00",
    estado: "confirmada",
    precio: 4000,
  },
];

export const reservasStore = reactive({
  reservas: [...reservasIniciales],

  agregarReserva(reserva) {
    const newId = Math.max(...this.reservas.map((r) => r.id), 0) + 1;

    const nuevaReserva = {
      id: newId,
      ...reserva,
      estado: reserva.estado || "confirmada",
    };

    this.reservas.push(nuevaReserva);
    return nuevaReserva;
  },

  getReservasPorCancha(canchaId) {
    return this.reservas.filter((r) => r.canchaId === canchaId);
  },

  getReservasHoy() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return this.reservas.filter((r) => {
      const reservaDate = new Date(r.fecha);
      reservaDate.setHours(0, 0, 0, 0);
      return reservaDate.getTime() === hoy.getTime();
    });
  },

  actualizarReserva(id, datos) {
    const index = this.reservas.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.reservas[index] = { ...this.reservas[index], ...datos };
      return true;
    }
    return false;
  },

  eliminarReserva(id) {
    const index = this.reservas.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.reservas.splice(index, 1);
      return true;
    }
    return false;
  },
});

export const reservas = reservasStore.reservas;
