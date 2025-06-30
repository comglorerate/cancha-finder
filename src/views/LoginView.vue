<template>
  <div class="login-container">
    <div class="form-container">
      <div class="tabs" role="tablist">
        <button
          :class="['tab-btn', { active: activeTab === 'login' }]"
          @click="activeTab = 'login'"
          id="tab-login"
          role="tab"
          aria-selected="activeTab === 'login'"
          aria-controls="panel-login"
        >
          Iniciar sesión
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'register' }]"
          @click="activeTab = 'register'"
          id="tab-register"
          role="tab"
          aria-selected="activeTab === 'register'"
          aria-controls="panel-register"
        >
          Registrarse
        </button>
      </div>

      <transition name="tab" mode="out-in">
        <!-- Login Form -->
        <form
          v-if="activeTab === 'login'"
          @submit.prevent="handleLogin"
          class="form"
          role="tabpanel"
          id="panel-login"
          aria-labelledby="tab-login"
        >
          <h2>Iniciar Sesión</h2>
          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-with-icon">
              <font-awesome-icon icon="envelope" class="input-icon" />
              <input
                type="email"
                id="email"
                v-model="loginForm.email"
                placeholder="tucorreo@ejemplo.com"
                required
                :class="{ 'input-error': loginFormErrors.email }"
                @blur="validateEmail(loginForm.email, 'login')"
                aria-describedby="login-email-error"
              />
            </div>
            <div
              v-if="loginFormErrors.email"
              id="login-email-error"
              class="error-text"
            >
              {{ loginFormErrors.email }}
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="input-with-icon">
              <font-awesome-icon icon="lock" class="input-icon" />
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="loginForm.password"
                placeholder="Tu contraseña"
                required
              />
            </div>
          </div>

          <div class="remember-forgot">
            <label class="remember">
              <input type="checkbox" v-model="loginForm.remember" />
              <span>Recordarme</span>
            </label>
            <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            <span
              v-if="isLoading"
              class="loading-state"
              aria-hidden="true"
            ></span>
            <span v-else><font-awesome-icon icon="sign-in-alt" /></span>
            Iniciar Sesión
          </button>

          <div v-if="loginError" class="error-message" role="alert">
            {{ loginError }}
          </div>
        </form>

        <!-- Register Form -->
        <form
          v-else
          @submit.prevent="handleRegister"
          class="form"
          role="tabpanel"
          id="panel-register"
          aria-labelledby="tab-register"
        >
          <h2>Crear una cuenta</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="reg-nombre">Nombre</label>
              <div class="input-with-icon">
                <font-awesome-icon icon="user" class="input-icon" />
                <input
                  type="text"
                  id="reg-nombre"
                  v-model="registerForm.nombre"
                  placeholder="Tu nombre"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="reg-apellido">Apellido</label>
              <div class="input-with-icon">
                <font-awesome-icon icon="user" class="input-icon" />
                <input
                  type="text"
                  id="reg-apellido"
                  v-model="registerForm.apellido"
                  placeholder="Tu apellido"
                  required
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="reg-email">Email</label>
            <div class="input-with-icon">
              <font-awesome-icon icon="envelope" class="input-icon" />
              <input
                type="email"
                id="reg-email"
                v-model="registerForm.email"
                placeholder="tucorreo@ejemplo.com"
                required
                :class="{ 'input-error': registerFormErrors.email }"
                @blur="validateEmail(registerForm.email, 'register')"
                aria-describedby="register-email-error"
              />
            </div>
            <div
              v-if="registerFormErrors.email"
              id="register-email-error"
              class="error-text"
            >
              {{ registerFormErrors.email }}
            </div>
          </div>

          <div class="form-group">
            <label for="reg-password">Contraseña</label>
            <div class="input-with-icon">
              <font-awesome-icon icon="lock" class="input-icon" />
              <input
                :type="showPassword ? 'text' : 'password'"
                id="reg-password"
                v-model="registerForm.password"
                placeholder="Crea una contraseña"
                required
                @input="checkPasswordStrength"
              />
            </div>
            <div
              v-if="passwordStrength"
              class="password-strength"
              :class="passwordStrengthClass"
            ></div>
            <div v-if="passwordFeedback" class="error-text">
              {{ passwordFeedback }}
            </div>
          </div>

          <div class="form-group">
            <label for="reg-password-confirm">Confirmar Contraseña</label>
            <div class="input-with-icon">
              <font-awesome-icon icon="lock" class="input-icon" />
              <input
                :type="showPassword ? 'text' : 'password'"
                id="reg-password-confirm"
                v-model="registerForm.passwordConfirm"
                placeholder="Confirma tu contraseña"
                required
                :class="{
                  'input-error':
                    !passwordsMatch && registerForm.passwordConfirm,
                }"
                @input="checkPasswordMatch"
              />
            </div>
            <div
              v-if="!passwordsMatch && registerForm.passwordConfirm"
              class="error-text"
            >
              Las contraseñas no coinciden
            </div>
          </div>

          <div class="terms-container">
            <label class="terms">
              <input type="checkbox" v-model="registerForm.terms" required />
              <span
                >Acepto los
                <a href="#" tabindex="0">términos y condiciones</a></span
              >
            </label>
          </div>

          <button
            type="submit"
            class="submit-btn"
            :disabled="isLoading || !passwordsMatch"
          >
            <span
              v-if="isLoading"
              class="loading-state"
              aria-hidden="true"
            ></span>
            <span v-else><font-awesome-icon icon="user-plus" /></span>
            Crear Cuenta
          </button>

          <div v-if="registerError" class="error-message" role="alert">
            {{ registerError }}
          </div>
        </form>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authStore } from "@/data/auth";

const route = useRoute();
const router = useRouter();
const activeTab = ref("login");
const showPassword = ref(false);
const loginError = ref("");
const registerError = ref("");
const isLoading = ref(false);
const passwordStrength = ref(0);
const passwordFeedback = ref("");
const passwordsMatch = ref(true);

const loginFormErrors = ref({ email: "" });
const registerFormErrors = ref({ email: "" });

const loginForm = ref({
  email: "",
  password: "",
  remember: false,
});

const registerForm = ref({
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  passwordConfirm: "",
  terms: false,
});

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value < 2) return "strength-weak";
  if (passwordStrength.value < 4) return "strength-medium";
  return "strength-strong";
});

const validateEmail = (email, formType) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors =
    formType === "login" ? loginFormErrors.value : registerFormErrors.value;

  if (!email) {
    errors.email = "El email es requerido";
  } else if (!emailRegex.test(email)) {
    errors.email = "Formato de email inválido";
  } else {
    errors.email = "";
  }
};

const checkPasswordStrength = () => {
  const password = registerForm.value.password;
  let strength = 0;
  let feedback = "";

  if (password.length >= 8) strength++;
  else feedback = "La contraseña debe tener al menos 8 caracteres";

  if (password.match(/[A-Z]/)) strength++;
  if (password.match(/[a-z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^A-Za-z0-9]/)) strength++;

  passwordStrength.value = strength;
  passwordFeedback.value = feedback;

  if (registerForm.value.passwordConfirm) {
    checkPasswordMatch();
  }
};

const checkPasswordMatch = () => {
  passwordsMatch.value =
    !registerForm.value.passwordConfirm ||
    registerForm.value.password === registerForm.value.passwordConfirm;
};

const handleLogin = async () => {
  validateEmail(loginForm.value.email, "login");
  if (loginFormErrors.value.email) return;

  loginError.value = "";
  isLoading.value = true;

  try {
    await new Promise((r) => setTimeout(r, 800));

    const success = authStore.login(
      loginForm.value.email,
      loginForm.value.password
    );

    if (success) {
      const redirectPath = route.query.redirect || "/";
      router.push(redirectPath);
    } else {
      loginError.value = "Las credenciales proporcionadas son incorrectas";
    }
  } catch (error) {
    console.error("Error en login:", error);
    loginError.value = "Ocurrió un error inesperado. Intenta nuevamente.";
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async () => {
  validateEmail(registerForm.value.email, "register");
  checkPasswordMatch();

  if (registerFormErrors.value.email || !passwordsMatch.value) return;

  registerError.value = "";
  isLoading.value = true;

  try {
    await new Promise((r) => setTimeout(r, 800));

    const success = authStore.register({
      nombre: registerForm.value.nombre,
      apellido: registerForm.value.apellido,
      email: registerForm.value.email,
      password: registerForm.value.password,
    });

    if (success) {
      router.push("/");
    } else {
      registerError.value = "El email ya está registrado";
    }
  } catch (error) {
    console.error("Error en registro:", error);
    registerError.value = "Ocurrió un error inesperado. Intenta nuevamente.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (route.query.tab === "register") {
    activeTab.value = "register";
  }
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  background-color: #f5f8fa;
  padding: 2rem 1rem;
}

.form-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e1e4e8;
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}

.form {
  padding: 1.5rem;
}

h2 {
  font-size: 1.5rem;
  color: #212529;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #adb5bd;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

input:focus {
  border-color: var(--primary-color);
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(20, 184, 166, 0.25);
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.forgot-link {
  color: var(--primary-color);
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.terms-container {
  margin-bottom: 1.5rem;
}

.terms {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.terms a {
  color: var(--primary-color);
  text-decoration: none;
}

.terms a:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(
    135deg,
    rgb(20, 184, 166) 0%,
    rgb(236, 72, 153) 100%
  );
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
}

.submit-btn:active {
  transform: translateY(-1px);
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

/* Indicador de carga */
.loading-state {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s ease infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Indicador de fortaleza de contraseña */
.password-strength {
  height: 5px;
  border-radius: 3px;
  margin-top: 8px;
  transition: all 0.3s ease;
}

.strength-weak {
  background-color: #f44336;
  width: 30%;
}
.strength-medium {
  background-color: #ff9800;
  width: 60%;
}
.strength-strong {
  background-color: #4caf50;
  width: 100%;
}

/* Transición entre tabs */
.tab-content {
  transition: opacity 0.3s ease;
}

.tab-enter-active,
.tab-leave-active {
  transition: opacity 0.3s ease;
}
.tab-enter-from,
.tab-leave-to {
  opacity: 0;
}

/* Error en campos */
.input-error {
  border-color: #dc3545 !important;
}

.error-text {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

/* Mejoras de accesibilidad - foco */
input:focus,
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.4);
}

.forgot-link:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.4);
  border-radius: 2px;
}

/* Responsive */
@media (max-width: 576px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form {
    padding: 1.2rem;
  }

  h2 {
    font-size: 1.3rem;
    margin-bottom: 1.2rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .submit-btn {
    padding: 0.65rem;
    font-size: 0.95rem;
  }

  .tab-btn {
    padding: 0.8rem 0.5rem;
    font-size: 0.9rem;
  }

  .remember-forgot {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
}
</style>
