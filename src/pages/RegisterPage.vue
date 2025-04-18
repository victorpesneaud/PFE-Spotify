<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1 class="page-title">Create Account</h1>
      
      <div class="auth-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            placeholder="Enter your name"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="Enter your email"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="Enter your password"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <input 
            type="password" 
            id="confirm-password" 
            v-model="confirmPassword" 
            placeholder="Confirm your password"
            class="form-input"
          />
        </div>
        <button @click="handleRegister" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? 'Creating account...' : 'Create Account' }}
        </button>
      </div>

      <p class="login-link">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref('')

const handleRegister = async () => {
  if (!name.value.trim() || !email.value.trim() || !password.value.trim()) {
    error.value = 'Please fill in all fields'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await userStore.register({
      name: name.value,
      email: email.value,
      password: password.value
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
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2d1b69 0%, #462985 100%);
  padding: 2rem;
}

.auth-container {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

.page-title {
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 500;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: white;
  font-size: 0.9rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #1db954;
  background: rgba(255, 255, 255, 0.15);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.submit-btn {
  background: #1db954;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.submit-btn:hover:not(:disabled) {
  background: #1ed760;
}

.submit-btn:disabled {
  background: #1db95480;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: white;
}

.login-link a {
  color: #1db954;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

.error-message {
  color: #ff4b4b;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .auth-container {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
}
</style> 