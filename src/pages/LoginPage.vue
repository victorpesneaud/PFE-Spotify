<template>
    <div class="login-container">
      <div class="login-box">
        <h1>Login</h1>
        <input v-model="email" placeholder="Email" value="test@spotify.com"/> test@spotify.com
        <input v-model="password" type="password" placeholder="Password" value="123456" /> 123456
        <button @click="handleLogin">Login</button>
        <p v-if="error">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { nextTick } from 'vue'
  
  const email = ref('')
  const password = ref('')
  const error = ref('')
  const userStore = useUserStore()
  const router = useRouter()
  
  const handleLogin = async () => {
  const loggedIn = await userStore.login(email.value, password.value)

  if (loggedIn) {
    await nextTick() // 💡 Attendre que le token devienne réactif
    router.push('/home')
  } else {
    error.value = 'Identifiants incorrects'
  }
}
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .login-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  }
  </style>