import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Importar estilos globales
import "./assets/css/main.css";

// Importar Vue Select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// Configuración de Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSearch,
  faUser,
  faCalendarAlt,
  faMapMarkerAlt,
  faClock,
  faCheckCircle,
  faSignOutAlt,
  faCog,
  faPlay,
  faArrowRight,
  faInfoCircle,
  // Agregar iconos faltantes según los errores
  faCalendarCheck,
  faUsers,
  faFutbol,
  faDollarSign,
  faChartLine,
  faPlus,
  faEye,
  faEdit,
  faTrash,
  faCheck,
  faTimes,
  faUserSlash,
  faUserCheck,
  faCalendarTimes,
  faUserPlus,
  faCreditCard,
  faHeart,
  faHeartBroken,
  faCamera,
  faEnvelope,
  faPhone,
  faBan,
  faHistory,
  faStar,
  faImage,
  faUpload,
  faKey,
  faBell,
  // Agregar los nuevos iconos
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faTableTennis,
  faBasketballBall,
  faVolleyballBall,
  faUserEdit,
  // Iconos adicionales que pueden estar faltando
  faExclamationCircle,
  faTimesCircle,
  faQuestionCircle,
  faFilter,
  faSort,
  faSortUp,
  faSortDown,
  faRedo,
  faUndo,
  faThumbsUp,
  faThumbsDown,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Agregar iconos
library.add(
  faSearch,
  faUser,
  faCalendarAlt,
  faMapMarkerAlt,
  faClock,
  faCheckCircle,
  faSignOutAlt,
  faCog,
  faPlay,
  faArrowRight,
  faInfoCircle,
  faCalendarCheck,
  faUsers,
  faFutbol,
  faDollarSign,
  faChartLine,
  faPlus,
  faEye,
  faEdit,
  faTrash,
  faCheck,
  faTimes,
  faUserSlash,
  faUserCheck,
  faCalendarTimes,
  faUserPlus,
  faCreditCard,
  faHeart,
  faHeartBroken,
  faCamera,
  faEnvelope,
  faPhone,
  faBan,
  faHistory,
  faStar,
  faImage,
  faUpload,
  faKey,
  faBell,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faTableTennis,
  faBasketballBall,
  faVolleyballBall,
  faUserEdit,
  // Iconos adicionales
  faExclamationCircle,
  faTimesCircle,
  faQuestionCircle,
  faFilter,
  faSort,
  faSortUp,
  faSortDown,
  faRedo,
  faUndo,
  faThumbsUp,
  faThumbsDown,
  faComments
);

const app = createApp(App);

// Registrar componentes globalmente
app.component("v-select", vSelect);
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(router);
app.mount("#app");
