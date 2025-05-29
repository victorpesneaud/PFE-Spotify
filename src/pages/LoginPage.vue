<template>
  <div class="login-container">
    <div class="login-box">
      <div class="tabs">
        <button 
          :class="['tab-btn', { active: activeTab === 'login' }]" 
          @click="activeTab = 'login'"
        >
          Sign In
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'register' }]" 
          @click="activeTab = 'register'"
        >
          Register
        </button>
      </div>

      <!-- Login Form -->
      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="form">
        <input 
          v-model="loginForm.email" 
          type="email"
          placeholder="Email" 
          required
        /> 
        <input 
          v-model="loginForm.password" 
          type="password" 
          placeholder="Password" 
          required
        /> 
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="handleRegister" class="form">
        <input 
          v-model="registerForm.name" 
          type="text"
          placeholder="Full Name" 
          required
        />
        <input 
          v-model="registerForm.email" 
          type="email"
          placeholder="Email" 
          required
        />
        <input 
          v-model="registerForm.password" 
          type="password" 
          placeholder="Password" 
          required
        />
        <input 
          v-model="registerForm.confirmPassword" 
          type="password" 
          placeholder="Confirm Password" 
          required
        />
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { nextTick } from 'vue'

const activeTab = ref('login')
const error = ref('')
const isLoading = ref(false)
const userStore = useUserStore()
const router = useRouter()

const loginForm = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    await userStore.login(loginForm.email, loginForm.password)
    router.push('/')
  } catch (err) {
    error.value = err.message || 'Failed to sign in'
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  error.value = ''

  if (registerForm.password !== registerForm.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  if (registerForm.password.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }

  isLoading.value = true

  try {
    await userStore.register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password
    })
    router.push('/')
  } catch (err) {
    error.value = err.message || 'Registration failed'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #2d1b69 0%, #462985 100%);
}

.login-box {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-width: 320px;
}

.tabs {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.tab-btn.active {
  color: white;
  border-bottom-color: #1db954;
}

.tab-btn:hover:not(.active) {
  color: rgba(255, 255, 255, 0.8);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 12px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

button[type="submit"] {
  padding: 12px;
  background: #1db954;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

button[type="submit"]:hover:not(:disabled) {
  background: #1ed760;
}

button[type="submit"]:disabled {
  background: #1db95480;
  cursor: not-allowed;
}

.error-message {
  color: #ff4b4b;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1rem;
}
</style>