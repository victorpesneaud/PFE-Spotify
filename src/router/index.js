import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import HomePage from '@/pages/HomePage.vue'
import AlbumPage from '@/pages/AlbumPage.vue'
import { useUserStore } from '@/stores/user'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/home', component: HomePage, meta: { requiresAuth: true } },
  { path: '/album/:name', component: AlbumPage, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔐 Garde globale d'authentification
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    console.log('🔒 Accès refusé → redirection vers /')
    next('/')
  } else {
    next()
  }
})

export default router