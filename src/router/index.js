import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import AlbumPage from '@/pages/AlbumPage.vue'
import UserPage from '@/pages/UserPage.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    },
    {
      path: '/album/:id',
      name: 'album',
      component: AlbumPage
    },
    {
      path: '/user/:id',
      name: 'user',
      component: UserPage
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isAuthenticated = userStore.isAuthenticated

  // Redirect authenticated users away from login page
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
    return
  }

  // Redirect unauthenticated users to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  next()
})

export default router