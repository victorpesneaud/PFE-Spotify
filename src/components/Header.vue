<template>
  <header class="header">
    <nav class="nav-container">
      <div class="nav-left">
        <router-link to="/" class="nav-link home-link">
          Home
        </router-link>
        
        <div class="search-container" v-if="userStore.isAuthenticated">
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="handleSearch"
            placeholder="Search for albums..."
            class="search-input"
          />
          <div class="search-results" v-if="searchResults.length && searchQuery">
            <router-link 
              v-for="album in searchResults" 
              :key="album.id"
              :to="`/album/${album.id}`"
              class="search-result-item"
              @click="handleAlbumClick"
            >
              <img :src="album.images[2]?.url" class="result-image" />
              <div class="result-info">
                <span class="result-name">{{ album.name }}</span>
                <span class="result-artist">{{ album.artists[0].name }}</span>
              </div>
            </router-link>
          </div>
        </div>
        <router-link :to="`/user/${userStore.user?.email}`" class="nav-link">
          {{ userStore.user?.name || userStore.user?.email }}
        </router-link>
        <button v-if="userStore.isAuthenticated" @click="handleLogout" class="logout-btn">
          Logout
        </button>
        <router-link v-else to="/login" class="login-btn">
          Login
        </router-link>
      </div>
      
      <div class="nav-right" v-if="userStore.isAuthenticated">
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const searchQuery = ref('')
const searchResults = ref([])
let searchTimeout

const handleSearch = async () => {
  clearTimeout(searchTimeout)
  
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery.value)}&type=album`, {
        headers: {
          'Authorization': `Bearer ${userStore.spotifyToken}`
        }
      })

      if (!response.ok) throw new Error('Search failed')

      const data = await response.json()
      searchResults.value = data.albums.items.slice(0, 5) // Limit to 5 results
    } catch (error) {
      console.error('Search error:', error)
      searchResults.value = []
    }
  }, 300) // Debounce search
}

const handleAlbumClick = () => {
  searchQuery.value = ''
  searchResults.value = []
  
  // Only force reload if we're currently on an album page
  if (router.currentRoute.value.path.startsWith('/album/')) {
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.header {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--header-height);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  height: 32px;
  width: auto;
}

.search-container {
  position: relative;
}

.search-input {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 0.9rem;
  width: 300px;
  transition: all 0.2s ease;
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.2);
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background: #282828;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-height: 400px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: white;
  transition: background-color 0.2s ease;
  gap: 1rem;
}

.search-result-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.result-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}

.result-info {
  display: flex;
  flex-direction: column;
}

.result-name {
  font-weight: 500;
}

.result-artist {
  font-size: 0.8rem;
  color: #b3b3b3;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #1db954;
}

.logout-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

.login-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

@media (max-width: 768px) {
  .search-input {
    width: 40vw;
  }

  .header {
    height: auto;
    min-height: var(--header-height);
    padding: 1rem 0;
    position: fixed;
    bottom: 0;
    top: auto;
    width: 100%;
    z-index: 1000;
  }

  .nav-container {
    padding: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .nav-left {
    gap: 1rem;
  }

  .logout-btn {
    display: none;
  }

  .search-results {
    bottom: 100%;
    top: auto;
    margin-bottom: 0.5rem;
    margin-top: 0;
  }
}
</style> 