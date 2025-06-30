<template>
  <div class="admin-container">
    <h1 class="admin-title">Panel de Administración</h1>

    <div class="admin-nav" role="tablist">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="activeTab = tab.id"
        :class="['nav-tab', { active: activeTab === tab.id }]"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`panel-${tab.id}`"
      >
        <font-awesome-icon :icon="tab.icon" class="tab-icon" />
        <span>{{ tab.name }}</span>
      </button>
    </div>

    <div class="admin-content">
      <div v-if="alertMessage" :class="['status-alert', alertType]">
        {{ alertMessage }}
        <button class="close-alert" @click="alertMessage = ''">×</button>
      </div>

      <!-- Dashboard -->
      <div
        v-if="activeTab === 'dashboard'"
        class="dashboard-section"
        role="tabpanel"
        id="panel-dashboard"
      >
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-icon reservations-icon">
              <font-awesome-icon icon="calendar-check" />
            </div>
            <div class="stat-info">
              <h3>{{ stats.reservasHoy }}</h3>
              <p>Reservas Hoy</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon users-icon">
              <font-awesome-icon icon="users" />
            </div>
            <div class="stat-info">
              <h3>{{ stats.totalUsuarios }}</h3>
              <p>Usuarios Totales</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon courts-icon">
              <font-awesome-icon icon="futbol" />
            </div>
            <div class="stat-info">
              <h3>{{ stats.totalCanchas }}</h3>
              <p>Canchas</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon revenue-icon">
              <font-awesome-icon icon="dollar-sign" />
            </div>
            <div class="stat-info">
              <h3>${{ stats.ingresosMes.toLocaleString() }}</h3>
              <p>Ingresos del Mes</p>
            </div>
          </div>
        </div>

        <div class="chart-container">
          <h2>Reservas por día (Últimos 7 días)</h2>
          <div class="chart-placeholder">
            <!-- Aquí iría un gráfico real usando una librería como Chart.js -->
            <div class="mock-chart">
              <div
                v-for="(value, index) in stats.reservasPorDia"
                :key="index"
                class="chart-bar"
                :style="{ height: (value / maxReservas) * 100 + '%' }"
              >
                <span class="bar-value">{{ value }}</span>
              </div>
            </div>
            <div class="chart-labels">
              <span v-for="(day, index) in dayLabels" :key="index">{{
                day
              }}</span>
            </div>
          </div>
        </div>

        <div class="recent-container">
          <div class="recent-activities">
            <h2>Actividad Reciente</h2>
            <ul class="activity-list">
              <li
                v-for="(activity, index) in recentActivities"
                :key="index"
                class="activity-item"
              >
                <div class="activity-icon" :class="activity.type">
                  <font-awesome-icon :icon="getActivityIcon(activity.type)" />
                </div>
                <div class="activity-details">
                  <p>{{ activity.description }}</p>
                  <small>{{ activity.time }}</small>
                </div>
              </li>
            </ul>
          </div>

          <div class="pending-approvals">
            <h2>Pendientes de Aprobación</h2>
            <ul class="approval-list">
              <li
                v-for="(approval, index) in pendingApprovals"
                :key="index"
                class="approval-item"
              >
                <div class="approval-info">
                  <strong>{{ approval.type }}:</strong>
                  {{ approval.description }}
                </div>
                <div class="approval-actions">
                  <button class="btn-approve">
                    <font-awesome-icon icon="check" />
                  </button>
                  <button class="btn-reject">
                    <font-awesome-icon icon="times" />
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Canchas -->
      <div
        v-if="activeTab === 'canchas'"
        class="section"
        role="tabpanel"
        id="panel-canchas"
      >
        <div class="section-header">
          <h2>Gestión de Canchas</h2>
          <button class="btn-add" @click="showCanchaForm = true">
            <font-awesome-icon icon="plus" /> Añadir Cancha
          </button>
        </div>

        <div class="filters">
          <div class="search-box">
            <input
              type="text"
              v-model="filters.canchaSearch"
              placeholder="Buscar canchas..."
            />
            <font-awesome-icon icon="search" />
          </div>
          <div class="filter-options">
            <v-select
              v-model="filters.deporteFilter"
              :options="deporteOptions"
              placeholder="Todos los deportes"
              :clearable="false"
              class="filter-select"
            ></v-select>
            <v-select
              v-model="filters.estadoFilter"
              :options="estadoOptions"
              placeholder="Todos los estados"
              :clearable="false"
              class="filter-select"
            ></v-select>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Deporte</th>
                <th>Precio/Hora</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cancha in filteredCanchas" :key="cancha.id">
                <td>#{{ cancha.id }}</td>
                <td>{{ cancha.nombre }}</td>
                <td>{{ cancha.ubicacion }}</td>
                <td>{{ cancha.deporte }}</td>
                <td>${{ cancha.precioHora }}</td>
                <td>
                  <span class="status-badge" :class="cancha.estado">{{
                    cancha.estado
                  }}</span>
                </td>
                <td class="actions-cell">
                  <button class="btn-edit" @click="editCancha(cancha)">
                    <font-awesome-icon icon="edit" />
                  </button>
                  <button class="btn-delete" @click="deleteCancha(cancha.id)">
                    <font-awesome-icon icon="trash" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="showCanchaForm" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>
                {{ editingCancha ? "Editar Cancha" : "Añadir Nueva Cancha" }}
              </h3>
              <button @click="showCanchaForm = false" class="btn-close">
                &times;
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveCancha" class="form">
                <div class="form-group">
                  <label>Nombre</label>
                  <input type="text" v-model="canchaForm.nombre" required />
                </div>
                <div class="form-group">
                  <label>Ubicación</label>
                  <input type="text" v-model="canchaForm.ubicacion" required />
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Deporte</label>
                    <select v-model="canchaForm.deporte" required>
                      <option value="Fútbol">Fútbol</option>
                      <option value="Tenis">Tenis</option>
                      <option value="Básquet">Básquet</option>
                      <option value="Pádel">Pádel</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Precio por Hora</label>
                    <input
                      type="number"
                      v-model="canchaForm.precioHora"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label>Estado</label>
                  <select v-model="canchaForm.estado" required>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="mantenimiento">Mantenimiento</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Descripción</label>
                  <textarea
                    v-model="canchaForm.descripcion"
                    rows="3"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label>Imagen URL</label>
                  <input type="text" v-model="canchaForm.imagen" />
                </div>

                <div class="form-buttons">
                  <button
                    type="button"
                    @click="showCanchaForm = false"
                    class="btn-cancel"
                  >
                    Cancelar
                  </button>
                  <button type="submit" class="btn-save">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Reservas -->
      <div
        v-if="activeTab === 'reservas'"
        class="section"
        role="tabpanel"
        id="panel-reservas"
      >
        <div class="section-header">
          <h2>Gestión de Reservas</h2>
          <button class="btn-add" @click="showReservaForm = true">
            <font-awesome-icon icon="plus" /> Nueva Reserva
          </button>
        </div>

        <div class="filters">
          <div class="search-box">
            <input
              type="text"
              v-model="filters.reservaSearch"
              placeholder="Buscar por cliente o cancha..."
            />
            <i class="fas fa-search"></i>
          </div>
          <div class="filter-options">
            <select v-model="filters.estadoReservaFilter">
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
              <option value="completada">Completada</option>
            </select>
            <input
              type="date"
              v-model="filters.fechaFilter"
              placeholder="Fecha"
            />
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Cancha</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Estado</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="reserva in filteredReservas" :key="reserva.id">
                <td>#{{ reserva.id }}</td>
                <td>{{ reserva.nombreCliente }}</td>
                <td>{{ reserva.nombreCancha }}</td>
                <td>{{ formatDate(reserva.fecha) }}</td>
                <td>{{ reserva.horaInicio }} - {{ reserva.horaFin }}</td>
                <td>
                  <span class="status-badge" :class="reserva.estado">{{
                    reserva.estado
                  }}</span>
                </td>
                <td>${{ reserva.precio }}</td>
                <td class="actions-cell">
                  <button class="btn-view" @click="viewReserva(reserva)">
                    <font-awesome-icon icon="eye" />
                  </button>
                  <button class="btn-edit" @click="editReserva(reserva)">
                    <font-awesome-icon icon="edit" />
                  </button>
                  <button class="btn-delete" @click="deleteReserva(reserva.id)">
                    <font-awesome-icon icon="trash" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Formulario para crear reservas -->
        <div v-if="showReservaForm" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Nueva Reserva</h3>
              <button @click="showReservaForm = false" class="btn-close">
                &times;
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveReserva" class="form">
                <!-- Campos del formulario -->
                <div class="form-group">
                  <label for="clienteReserva">Cliente</label>
                  <select
                    id="clienteReserva"
                    v-model="reservaForm.clienteId"
                    required
                  >
                    <option
                      v-for="usuario in usuariosClientes"
                      :key="usuario.id"
                      :value="usuario.id"
                    >
                      {{ usuario.nombre }} {{ usuario.apellido }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="canchaReserva">Cancha</label>
                  <select
                    id="canchaReserva"
                    v-model="reservaForm.canchaId"
                    required
                  >
                    <option
                      v-for="cancha in canchasActivas"
                      :key="cancha.id"
                      :value="cancha.id"
                    >
                      {{ cancha.nombre }}
                    </option>
                  </select>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="fechaReserva">Fecha</label>
                    <input
                      type="date"
                      id="fechaReserva"
                      v-model="reservaForm.fecha"
                      min="today"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="horaReserva">Hora</label>
                    <select
                      id="horaReserva"
                      v-model="reservaForm.hora"
                      required
                    >
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                      <option value="18:00">18:00</option>
                      <option value="19:00">19:00</option>
                      <option value="20:00">20:00</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label for="duracionReserva">Duración (horas)</label>
                  <select
                    id="duracionReserva"
                    v-model="reservaForm.duracion"
                    required
                  >
                    <option value="1">1 hora</option>
                    <option value="2">2 horas</option>
                    <option value="3">3 horas</option>
                  </select>
                </div>

                <div class="form-buttons">
                  <button
                    type="button"
                    @click="showReservaForm = false"
                    class="btn-cancel"
                  >
                    Cancelar
                  </button>
                  <button type="submit" class="btn-save">
                    Guardar Reserva
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Usuarios -->
      <div
        v-if="activeTab === 'usuarios'"
        class="section"
        role="tabpanel"
        id="panel-usuarios"
      >
        <div class="section-header">
          <h2>Gestión de Usuarios</h2>
          <button class="btn-add" @click="showUsuarioForm = true">
            <font-awesome-icon icon="plus" /> Añadir Usuario
          </button>
        </div>

        <div class="filters">
          <div class="search-box">
            <input
              type="text"
              v-model="filters.usuarioSearch"
              placeholder="Buscar usuarios..."
            />
            <i class="fas fa-search"></i>
          </div>
          <div class="filter-options">
            <select v-model="filters.rolFilter">
              <option value="">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="cliente">Cliente</option>
            </select>
            <select v-model="filters.estatusFilter">
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in filteredUsuarios" :key="usuario.id">
                <td>#{{ usuario.id }}</td>
                <td>{{ usuario.nombre }} {{ usuario.apellido }}</td>
                <td>{{ usuario.email }}</td>
                <td>{{ usuario.telefono || "-" }}</td>
                <td>{{ usuario.rol }}</td>
                <td>
                  <span class="status-badge" :class="usuario.estatus">{{
                    usuario.estatus
                  }}</span>
                </td>
                <td>{{ formatDate(usuario.fechaRegistro) }}</td>
                <td class="actions-cell">
                  <button class="btn-edit" @click="editUsuario(usuario)">
                    <font-awesome-icon icon="edit" />
                  </button>
                  <button
                    class="btn-status"
                    :class="
                      usuario.estatus === 'activo'
                        ? 'btn-disable'
                        : 'btn-enable'
                    "
                    @click="toggleUsuarioStatus(usuario)"
                  >
                    <font-awesome-icon
                      :icon="
                        usuario.estatus === 'activo'
                          ? 'user-slash'
                          : 'user-check'
                      "
                    />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Formulario para crear usuarios -->
        <div v-if="showUsuarioForm" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>{{ editingUsuario ? "Editar Usuario" : "Nuevo Usuario" }}</h3>
              <button @click="showUsuarioForm = false" class="btn-close">
                &times;
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveUsuario" class="form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="nombreUsuario">Nombre</label>
                    <input
                      type="text"
                      id="nombreUsuario"
                      v-model="usuarioForm.nombre"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="apellidoUsuario">Apellido</label>
                    <input
                      type="text"
                      id="apellidoUsuario"
                      v-model="usuarioForm.apellido"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="emailUsuario">Email</label>
                  <input
                    type="email"
                    id="emailUsuario"
                    v-model="usuarioForm.email"
                    required
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="telefonoUsuario">Teléfono</label>
                    <input
                      type="tel"
                      id="telefonoUsuario"
                      v-model="usuarioForm.telefono"
                    />
                  </div>
                  <div class="form-group">
                    <label for="rolUsuario">Rol</label>
                    <select id="rolUsuario" v-model="usuarioForm.rol" required>
                      <option value="cliente">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>

                <div class="form-buttons">
                  <button
                    type="button"
                    @click="showUsuarioForm = false"
                    class="btn-cancel"
                  >
                    Cancelar
                  </button>
                  <button type="submit" class="btn-save">
                    Guardar Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuración -->
      <div
        v-if="activeTab === 'configuracion'"
        class="section"
        role="tabpanel"
        id="panel-configuracion"
      >
        <h2>Configuración del Sistema</h2>

        <div class="config-section">
          <h3>Ajustes Generales</h3>
          <form class="form">
            <div class="form-group">
              <label>Nombre del Sitio</label>
              <input type="text" v-model="configuracion.nombreSitio" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Email de Contacto</label>
                <input type="email" v-model="configuracion.emailContacto" />
              </div>
              <div class="form-group">
                <label>Teléfono de Contacto</label>
                <input type="text" v-model="configuracion.telefonoContacto" />
              </div>
            </div>
            <div class="form-group">
              <label>Horario de Atención</label>
              <input type="text" v-model="configuracion.horarioAtencion" />
            </div>
          </form>
        </div>

        <div class="config-section">
          <h3>Notificaciones</h3>
          <div class="toggle-options">
            <div class="toggle-option">
              <span>Enviar emails de confirmación de reserva</span>
              <label class="switch">
                <input
                  type="checkbox"
                  v-model="configuracion.emailConfirmacion"
                />
                <span class="slider"></span>
              </label>
            </div>
            <div class="toggle-option">
              <span>Enviar recordatorio de reserva (24h antes)</span>
              <label class="switch">
                <input
                  type="checkbox"
                  v-model="configuracion.emailRecordatorio"
                />
                <span class="slider"></span>
              </label>
            </div>
            <div class="toggle-option">
              <span>Notificar cancelaciones</span>
              <label class="switch">
                <input
                  type="checkbox"
                  v-model="configuracion.emailCancelacion"
                />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="form-buttons">
          <button type="button" class="btn-cancel">Restablecer</button>
          <button type="button" class="btn-save">Guardar Configuración</button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Cargando...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { canchasStore } from "../data/canchas";
import { reservasStore } from "../data/reservas";

const activeTab = ref("dashboard");
const tabs = ref([
  { id: "dashboard", name: "Dashboard", icon: "chart-line" },
  { id: "canchas", name: "Canchas", icon: "futbol" },
  { id: "reservas", name: "Reservas", icon: "calendar-alt" },
  { id: "usuarios", name: "Usuarios", icon: "users" },
  { id: "configuracion", name: "Configuración", icon: "cog" },
]);

const stats = reactive({
  reservasHoy: 12,
  totalUsuarios: 145,
  totalCanchas: 8,
  ingresosMes: 25600,
  reservasPorDia: [5, 8, 12, 10, 15, 20, 12],
});

const recentActivities = ref([
  {
    type: "reservation",
    description: "Juan Pérez reservó Cancha El Gol para hoy a las 19:00",
    time: "Hace 10 minutos",
  },
  {
    type: "cancellation",
    description: "María López canceló su reserva para el 15/11",
    time: "Hace 1 hora",
  },
  {
    type: "new-user",
    description: "Pedro Gómez se registró como nuevo usuario",
    time: "Hace 2 horas",
  },
  {
    type: "payment",
    description: "Pago recibido por reserva #12345",
    time: "Hace 3 horas",
  },
]);

const pendingApprovals = ref([
  { type: "Usuario", description: "Verificación de Martín Rodríguez" },
  {
    type: "Cancha",
    description: "Nueva cancha agregada por Complejo Deportivo Norte",
  },
  {
    type: "Reserva",
    description: "Solicitud de cancelación y reembolso #5678",
  },
]);

const usuarios = ref([
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@email.com",
    telefono: "123-456-7890",
    rol: "cliente",
    estatus: "activo",
    fechaRegistro: new Date(2023, 6, 15),
  },
  {
    id: 2,
    nombre: "María",
    apellido: "López",
    email: "maria.lopez@email.com",
    telefono: "987-654-3210",
    rol: "cliente",
    estatus: "activo",
    fechaRegistro: new Date(2023, 7, 23),
  },
  {
    id: 3,
    nombre: "Admin",
    apellido: "Principal",
    email: "admin@canchasfinder.com",
    telefono: "555-555-5555",
    rol: "admin",
    estatus: "activo",
    fechaRegistro: new Date(2023, 1, 1),
  },
  {
    id: 4,
    nombre: "Roberto",
    apellido: "Sánchez",
    email: "roberto.sanchez@email.com",
    telefono: null,
    rol: "cliente",
    estatus: "inactivo",
    fechaRegistro: new Date(2023, 8, 5),
  },
  {
    id: 5,
    nombre: "Laura",
    apellido: "Martínez",
    email: "laura.martinez@email.com",
    telefono: "111-222-3333",
    rol: "cliente",
    estatus: "activo",
    fechaRegistro: new Date(2023, 9, 10),
  },
]);

const showCanchaForm = ref(false);
const showReservaForm = ref(false);
const showUsuarioForm = ref(false);
const editingCancha = ref(null);
const editingUsuario = ref(null);
const isLoading = ref(false);
const alertMessage = ref("");
const alertType = ref("success");

const canchaForm = reactive({
  nombre: "",
  ubicacion: "",
  deporte: "",
  precioHora: 0,
  estado: "activo",
  descripcion: "",
  imagen: "",
});

const reservaForm = reactive({
  clienteId: null,
  canchaId: null,
  fecha: null,
  hora: null,
  duracion: 1,
});

const usuarioForm = reactive({
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  rol: "cliente",
});

const filters = reactive({
  canchaSearch: "",
  deporteFilter: "",
  estadoFilter: "",
  reservaSearch: "",
  estadoReservaFilter: "",
  fechaFilter: "",
  usuarioSearch: "",
  rolFilter: "",
  estatusFilter: "",
});

const configuracion = reactive({
  nombreSitio: "Cancha Finder",
  emailContacto: "contacto@canchasfinder.com",
  telefonoContacto: "0800-123-4567",
  horarioAtencion: "Lunes a Viernes 9:00 - 18:00",
  emailConfirmacion: true,
  emailRecordatorio: true,
  emailCancelacion: true,
});

const dayLabels = ref(["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]);

const deporteOptions = [
  { label: "Todos los deportes", value: "" },
  { label: "Fútbol", value: "Fútbol" },
  { label: "Tenis", value: "Tenis" },
  { label: "Básquet", value: "Básquet" },
  { label: "Pádel", value: "Pádel" },
];

const estadoOptions = [
  { label: "Todos los estados", value: "" },
  { label: "Activo", value: "activo" },
  { label: "Inactivo", value: "inactivo" },
  { label: "Mantenimiento", value: "mantenimiento" },
];

const maxReservas = computed(() => Math.max(...stats.reservasPorDia));

const filteredCanchas = computed(() => {
  return canchasStore.canchas.filter((cancha) => {
    const matchSearch =
      cancha.nombre
        .toLowerCase()
        .includes(filters.canchaSearch.toLowerCase()) ||
      cancha.ubicacion
        .toLowerCase()
        .includes(filters.canchaSearch.toLowerCase());
    const matchDeporte =
      !filters.deporteFilter || cancha.tipo === filters.deporteFilter;
    const matchEstado =
      !filters.estadoFilter ||
      (cancha.estado || "activo") === filters.estadoFilter;

    return matchSearch && matchDeporte && matchEstado;
  });
});

const filteredReservas = computed(() => {
  return reservasStore.reservas.filter((reserva) => {
    const matchSearch =
      reserva.nombreCliente
        .toLowerCase()
        .includes(filters.reservaSearch.toLowerCase()) ||
      reserva.nombreCancha
        .toLowerCase()
        .includes(filters.reservaSearch.toLowerCase());
    const matchEstado =
      !filters.estadoReservaFilter ||
      reserva.estado === filters.estadoReservaFilter;

    let matchFecha = true;
    if (filters.fechaFilter) {
      const filterDate = new Date(filters.fechaFilter);
      const reservaDate = new Date(reserva.fecha);
      matchFecha = filterDate.toDateString() === reservaDate.toDateString();
    }

    return matchSearch && matchEstado && matchFecha;
  });
});

const filteredUsuarios = computed(() => {
  return usuarios.value.filter((usuario) => {
    const fullName = `${usuario.nombre} ${usuario.apellido}`.toLowerCase();
    const matchSearch =
      fullName.includes(filters.usuarioSearch.toLowerCase()) ||
      usuario.email.toLowerCase().includes(filters.usuarioSearch.toLowerCase());
    const matchRol = !filters.rolFilter || usuario.rol === filters.rolFilter;
    const matchEstatus =
      !filters.estatusFilter || usuario.estatus === filters.estatusFilter;

    return matchSearch && matchRol && matchEstatus;
  });
});

const usuariosClientes = computed(() =>
  usuarios.value.filter((user) => user.estatus === "activo")
);
const canchasActivas = computed(() =>
  canchasStore.canchas.filter(
    (cancha) => cancha.estado === "activo" || !cancha.estado
  )
);

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-ES");
};

const getActivityIcon = (type) => {
  switch (type) {
    case "reservation":
      return "calendar-check";
    case "cancellation":
      return "calendar-times";
    case "new-user":
      return "user-plus";
    case "payment":
      return "credit-card";
    default:
      return "info-circle";
  }
};

const editCancha = (cancha) => {
  editingCancha.value = cancha;
  canchaForm.nombre = cancha.nombre;
  canchaForm.ubicacion = cancha.ubicacion;
  canchaForm.deporte = cancha.tipo;
  canchaForm.precioHora = cancha.precio;
  canchaForm.estado = cancha.estado || "activo";
  canchaForm.descripcion = cancha.descripcion;
  canchaForm.imagen = cancha.imagen;
  showCanchaForm.value = true;
};

const deleteCancha = (id) => {
  if (confirm("¿Estás seguro de que deseas eliminar esta cancha?")) {
    if (canchasStore.eliminarCancha(id)) {
      stats.totalCanchas = canchasStore.canchas.length;
      showAlert("Cancha eliminada correctamente");
    }
  }
};

const saveCancha = () => {
  try {
    isLoading.value = true;

    if (editingCancha.value) {
      canchasStore.actualizacionCancha(editingCancha.value.id, canchaForm);
      showAlert("Cancha actualizada correctamente");
    } else {
      canchasStore.agregarCancha(canchaForm);
      stats.totalCanchas = canchasStore.canchas.length;
      showAlert("Cancha añadida correctamente");
    }

    showCanchaForm.value = false;
    editingCancha.value = null;
    Object.assign(canchaForm, {
      nombre: "",
      ubicacion: "",
      deporte: "",
      precioHora: 0,
      estado: "activo",
      descripcion: "",
      imagen: "",
    });
  } catch (error) {
    console.error("Error al guardar cancha:", error);
    showAlert("Error al guardar la cancha", "error");
  } finally {
    isLoading.value = false;
  }
};

const viewReserva = (reserva) => {
  alert(
    `Detalles de la reserva #${reserva.id}:\n\nCliente: ${
      reserva.nombreCliente
    }\nCancha: ${reserva.nombreCancha}\nFecha: ${formatDate(
      reserva.fecha
    )}\nHorario: ${reserva.horaInicio} - ${reserva.horaFin}\nEstado: ${
      reserva.estado
    }\nPrecio: $${reserva.precio}`
  );
};

const editReserva = (reserva) => {
  alert(`Editar reserva #${reserva.id}`);
};

const deleteReserva = (id) => {
  if (confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
    reservasStore.eliminarReserva(id);
    showAlert("Reserva eliminada correctamente");
  }
};

const editUsuario = (usuario) => {
  alert(`Editar usuario: ${usuario.nombre} ${usuario.apellido}`);
};

const toggleUsuarioStatus = (usuario) => {
  const newStatus = usuario.estatus === "activo" ? "inactivo" : "activo";
  const index = usuarios.value.findIndex((u) => u.id === usuario.id);

  if (index !== -1) {
    usuarios.value[index].estatus = newStatus;
    showAlert(
      `Usuario ${usuarios.value[index].nombre} ${
        usuarios.value[index].apellido
      } ${newStatus === "activo" ? "activado" : "desactivado"} correctamente`
    );
  }
};

const showAlert = (message, type = "success") => {
  alertMessage.value = message;
  alertType.value = type;
  setTimeout(() => {
    alertMessage.value = "";
  }, 3000);
};

const saveReserva = () => {
  try {
    isLoading.value = true;
    showReservaForm.value = false;
    showAlert("Reserva creada correctamente");
  } catch (error) {
    console.error("Error al guardar reserva:", error);
    showAlert("Error al crear la reserva", "error");
  } finally {
    isLoading.value = false;
  }
};

const saveUsuario = () => {
  try {
    isLoading.value = true;
    showUsuarioForm.value = false;
    showAlert("Usuario guardado correctamente");
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    showAlert("Error al guardar el usuario", "error");
  } finally {
    isLoading.value = false;
  }
};

const handleKeyDown = (e) => {
  if (e.key === "Escape") {
    showCanchaForm.value = false;
    showReservaForm.value = false;
    showUsuarioForm.value = false;
  }
};

stats.totalCanchas = canchasStore.canchas.length;
stats.reservasHoy = reservasStore.getReservasHoy().length;

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
/* Estilos base */
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.admin-title {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
}

/* Navegación */
.admin-nav {
  display: flex;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 30px;
  overflow-x: auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.nav-tab {
  padding: 15px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #555;
  transition: all 0.3s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-tab:hover {
  background-color: #e9ecef;
}

.nav-tab.active {
  background-color: var(--primary-color);
  color: white;
}

.nav-tab i {
  font-size: 1.2rem;
}

/* Cards y contenedores */
.section,
.recent-activities,
.pending-approvals,
.chart-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2,
.chart-container h2,
.recent-activities h2,
.pending-approvals h2,
.config-section h3 {
  margin-top: 0;
  font-size: 1.3rem;
  color: #444;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.recent-activities h2,
.pending-approvals h2 {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

/* Dashboard - Estadísticas */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.reservations-icon {
  background-color: var(--primary-color);
}
.users-icon {
  background-color: #2196f3;
}
.courts-icon {
  background-color: #ff9800;
}
.revenue-icon {
  background-color: #9c27b0;
}

.stat-info h3 {
  font-size: 1.8rem;
  margin: 0 0 5px 0;
}

.stat-info p {
  margin: 0;
  color: #777;
  font-size: 0.9rem;
}

/* Gráficos */
.chart-container {
  margin-bottom: 30px;
}

.mock-chart {
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 10px;
}

.chart-bar {
  flex: 1;
  background-color: var(--primary-color);
  margin: 0 5px;
  min-height: 20px;
  border-radius: 4px 4px 0 0;
  position: relative;
  display: flex;
  justify-content: center;
}

.chart-bar .bar-value {
  position: absolute;
  top: -25px;
  font-size: 0.85rem;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
}

.chart-labels span {
  flex: 1;
  text-align: center;
  font-size: 0.85rem;
  color: #777;
}

/* Recent activities and approvals */
.recent-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.recent-activities,
.pending-approvals {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.recent-activities h2,
.pending-approvals h2 {
  margin-top: 0;
  font-size: 1.3rem;
  color: #444;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.activity-list,
.approval-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item,
.approval-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child,
.approval-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: white;
}

.activity-icon.reservation {
  background-color: var(--primary-color);
}
.activity-icon.cancellation {
  background-color: #f44336;
}
.activity-icon.new-user {
  background-color: #2196f3;
}
.activity-icon.payment {
  background-color: #9c27b0;
}

.activity-details {
  flex: 1;
}

.activity-details p {
  margin: 0 0 5px 0;
}

.activity-details small {
  color: #777;
  font-size: 0.8rem;
}

.approval-item {
  justify-content: space-between;
}

.approval-actions {
  display: flex;
  gap: 10px;
}

/* Filtros y búsqueda */
.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.search-box {
  flex: 1;
  position: relative;
  min-width: 250px;
}

.search-box input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.search-box i {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
}

.filter-options {
  display: flex;
  gap: 15px;
}

.filter-options select,
.filter-options input {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

/* Tablas */
.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 15px;
  text-align: left;
}

.data-table th {
  background-color: #f8f9fa;
  color: #444;
  border-bottom: 2px solid #ddd;
}

.data-table tbody tr {
  border-bottom: 1px solid #ddd;
}

.data-table tbody tr:last-child {
  border-bottom: none;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* Badges y status */
.status-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  display: inline-block;
}

.status-badge.activo,
.status-badge.confirmada,
.status-badge.completada {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-badge.inactivo,
.status-badge.cancelada {
  background-color: #ffebee;
  color: #c62828;
}

.status-badge.mantenimiento,
.status-badge.pendiente {
  background-color: #fff8e1;
  color: #f57f17;
}

/* Botones */
.btn-add,
.btn-save {
  background-color: var(--primary-color);
  color: white;
}

.btn-cancel {
  background-color: #f1f1f1;
  color: #555;
}

.btn-view {
  background-color: #2196f3;
}
.btn-edit {
  background-color: #ff9800;
}
.btn-delete {
  background-color: #f44336;
}
.btn-enable {
  background-color: var(--primary-color);
}
.btn-disable {
  background-color: #f44336;
}

.btn-add {
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-edit,
.btn-delete,
.btn-view,
.btn-status,
.btn-approve,
.btn-reject {
  width: 35px;
  height: 35px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  color: white;
}

.btn-approve,
.btn-reject {
  border-radius: 50%;
  font-size: 0.9rem;
}

.btn-approve {
  background-color: var(--primary-color);
}
.btn-reject {
  background-color: #f44336;
}

.actions-cell {
  display: flex;
  gap: 5px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-save {
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

/* Modales */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
}

.modal-header h3 {
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

/* Formularios */
.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

/* Configuraciones */
.config-section {
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.toggle-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.toggle-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Switch toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Ajustes para v-select en el panel admin */
.filter-select {
  min-width: 180px;
}

.form-group .vs__dropdown-toggle {
  padding: 0.5rem;
  border-radius: 4px;
}

/* Indicador de carga */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Alerta de estado */
.status-alert {
  padding: 12px 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  position: relative;
  animation: fadeIn 0.5s;
}

.status-alert.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-alert.error {
  background-color: #ffebee;
  color: #c62828;
}

.close-alert {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
}

.close-alert:hover {
  opacity: 1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mejorar visualización en pantallas pequeñas */
@media (max-width: 576px) {
  .admin-container {
    padding: 10px;
  }

  .admin-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .tab-icon {
    margin-right: 5px;
  }

  .data-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }

  .data-table th,
  .data-table td {
    padding: 8px 10px;
    font-size: 0.9rem;
  }

  .recent-container {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-group {
    margin-bottom: 15px;
  }
}
</style>
