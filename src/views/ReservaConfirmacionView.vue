<template>
  <div class="reserva-confirmation-container">
    <div class="confirmation-card">
      <h1 class="confirmation-title">Confirma Tu Reserva</h1>
      <p class="confirmation-subtitle">
        Revisa los detalles de tu reserva y confirma para asegurar tu lugar.
      </p>

      <div class="resumen-reserva">
        <h2>Resumen de la Reserva</h2>
        <div class="detalle-item">
          <font-awesome-icon icon="futbol" class="detalle-icon" />
          <div class="detalle-content">
            <strong>Cancha:</strong> {{ reservaData.cancha.nombre }} (ID:
            {{ reservaData.cancha.id }})
          </div>
        </div>
        <div class="detalle-item">
          <font-awesome-icon icon="calendar" class="detalle-icon" />
          <div class="detalle-content">
            <strong>Fecha:</strong> {{ formattedDate }}
          </div>
        </div>
        <div class="detalle-item">
          <font-awesome-icon icon="clock" class="detalle-icon" />
          <div class="detalle-content">
            <strong>Hora:</strong> {{ reservaData.horaInicio }} -
            {{ reservaData.horaFin }}
          </div>
        </div>
        <div class="detalle-item precio-total">
          <font-awesome-icon icon="dollar-sign" class="detalle-icon" />
          <div class="detalle-content">
            <strong>Precio Total:</strong> ${{
              reservaData.precioTotal.toFixed(2)
            }}
          </div>
        </div>
      </div>

      <div class="pago-info">
        <h3><font-awesome-icon icon="info-circle" /> Información de Pago</h3>
        <p>
          El pago se procesará en el lugar. Esta reserva confirma tu horario.
        </p>
      </div>

      <div class="confirmation-actions">
        <button @click="confirmarReserva" class="btn-confirmar">
          <font-awesome-icon icon="check" /> Confirmar Reserva
        </button>
        <button @click="volverADetalles" class="btn-volver">
          Volver a Detalles de la Cancha
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { canchasStore } from "@/data/canchas";
import { usuariosStore } from "@/data/usuarios";
import { reservasStore } from "@/data/reservas";

const route = useRoute();
const router = useRouter();

const reservaData = reactive({
  cancha: {},
  fecha: new Date(),
  horaInicio: "",
  horaFin: "",
  precioTotal: 0,
});

const formattedDate = computed(() => {
  if (!reservaData.fecha) return "";
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(reservaData.fecha).toLocaleDateString("es-ES", options);
});

const loadReservaData = () => {
  const canchaId = parseInt(route.params.canchaId);
  const cancha = canchasStore.canchas.find((c) => c.id === canchaId);

  if (cancha) {
    const horaInicio = route.query.hora || "18:00";
    const horaFin = calcularHoraFin(horaInicio);

    reservaData.cancha = cancha;
    reservaData.fecha = route.query.fecha
      ? new Date(route.query.fecha)
      : new Date();
    reservaData.horaInicio = horaInicio;
    reservaData.horaFin = horaFin;
    reservaData.precioTotal =
      cancha.precio * (parseInt(route.query.duracion) || 1);
  } else {
    router.push({ name: "canchas" });
  }
};

const calcularHoraFin = (horaInicio) => {
  const [horas, minutos] = horaInicio.split(":").map(Number);
  const duracion = parseInt(route.query.duracion) || 1;
  let horaFin = horas + duracion;
  return `${horaFin.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}`;
};

const confirmarReserva = () => {
  const reserva = {
    nombreCliente: `${usuariosStore.usuario.nombre} ${usuariosStore.usuario.apellido}`,
    nombreCancha: reservaData.cancha.nombre,
    canchaId: reservaData.cancha.id,
    fecha: reservaData.fecha,
    horaInicio: reservaData.horaInicio,
    horaFin: reservaData.horaFin,
    estado: "confirmada",
    precio: reservaData.precioTotal,
  };

  reservasStore.agregarReserva(reserva);
  alert("¡Reserva confirmada con éxito!");
  router.push({
    name: "perfil",
    params: {
      reservaConfirmada: true,
      canchaId: reservaData.cancha.id,
    },
  });
};

const volverADetalles = () => {
  router.push({
    name: "canchaDetail",
    params: { id: reservaData.cancha.id },
  });
};

onMounted(() => {
  loadReservaData();
});
</script>

<style scoped>
.reserva-confirmation-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.confirmation-card {
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.confirmation-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.confirmation-subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.resumen-reserva {
  margin-bottom: 2rem;
}

.detalle-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
}

.precio-total {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed #ddd;
  font-size: 1.1rem;
}

.detalle-icon {
  font-size: 1.5rem;
  width: 40px;
  color: #4a90e2;
}

.detalle-content {
  flex: 1;
}

.pago-info {
  background-color: #f5f8ff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.pago-info h3 {
  color: #4a90e2;
  margin-bottom: 0.5rem;
}

.confirmation-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-confirmar {
  padding: 0.75rem 1.5rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  flex: 2;
}

.btn-volver {
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  flex: 1;
}

.btn-confirmar:hover {
  background-color: #45a049;
}

.btn-volver:hover {
  background-color: #f5f5f5;
}
</style>
