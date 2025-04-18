<template>
    <div class="home-container">
        <h1>Bienvenue sur la page d'accueil {{ userStore.prenom }}!</h1>
        <p>Token Spotify : {{ userStore.token }}</p>

    <div v-if="userStore.favorites.length" class="favorites-section">
        <div class="favorites-header">
            <h2>Favoris ({{ userStore.favorites.length }})</h2>
            <router-link to="/favoris" class="all-link">Voir tout</router-link>
        </div>
        <div class="favorites-list">
            <router-link
            v-for="album in userStore.favorites"
            :key="album.id"
            :to="`/album/${album.id}`"
            class="favorite-album"
            >
            <img :src="album.images?.[0]?.url" />
            <h3>{{album.name}}</h3>
            </router-link>
        </div>
    </div>

    <input v-model="searchTerm" placeholder="Rechercher un album" class="search-input" />
    <button @click="searchAlbum" class="search-btn">Rechercher</button>

    <div v-if="albums.length" class="albums-grid">
      <div v-for="album in albums" :key="album.id" class="album-card">
        <router-link :to="`/album/${album.id}`">
          <img :src="album.images[0]?.url" alt="cover" class="album-img" />
          <div class="album-info">
            <h3>{{ album.name }}</h3>
            <p>{{ album.artists[0].name }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const userStore = useUserStore()
const searchTerm = ref('')
const albums = ref([])
const router = useRouter()

const searchAlbum = async () => {
    const token = userStore.token
    const query = encodeURIComponent(searchTerm.value)

    const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album`, {
        headers: {
        Authorization: `Bearer ${token}`
        }
    })

    onMounted(() => {
    console.log('✅ HomePage mounted')
    })
  const data = await res.json()
  albums.value = data.albums.items
  console.log(albums)
}

</script>

<style scoped>
.home-container {
  padding: 2rem;
  background: linear-gradient(135deg, #2d1b69 0%, #462985 100%);
}

.search-input {
  padding: 0.5rem;
  font-size: 1rem;
  width: 300px;
  margin-right: 10px;
}

.search-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}

.albums-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

.album-card {
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  background: #f9f9f9;
  transition: transform 0.2s ease;
}

.album-card:hover {
  transform: scale(1.05);
}

.album-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.album-info {
  padding: 0.5rem;
}
.favorites-section {
  margin-top: 3rem;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.favorites-header h2 {
  margin: 0;
}

.all-link {
  font-size: 0.9rem;
  color: #1db954;
  text-decoration: none;
}

.all-link:hover {
  text-decoration: underline;
}

.favorites-list {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
}

.favorite-album img {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.favorite-album img:hover {
  transform: scale(1.05);
}

.favorite-album {
    max-width: 160px;
    margin-right: 20px;
}

.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #2d1b69 0%, #462985 100%);
  padding: 2rem;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.album-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
  text-decoration: none;
  color: white;
}

.album-card:hover {
  transform: translateY(-2px);
}

.album-cover {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.album-info {
  padding: 1rem;
}

.album-info h3 {
  margin: 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-info p {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: #b3b3b3;
}

@media (max-width: 768px) {
  .album-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
}
</style>