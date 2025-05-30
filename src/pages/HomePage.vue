<template>
    <div class="home-container">
        <h1 v-if="userStore.isAuthenticated">Welcome back, {{ userStore.user.name }}! Here's what the world is listening to. </h1>
        <h1 v-else>Welcome to Spotifind! The application can only work once you're logged in, please</h1>
        <h1 v-if="!userStore.isAuthenticated"><router-link to="/login">Login or Register here</router-link></h1>
        <h4 v-if="userStore.isAuthenticated">This homepage will become customized as you follow active members on Spotifind. </h4>
      
        <AlbumList
            v-if="newPopularAlbums.length"
            title="Nouveautés populaires"
            :albums="newPopularAlbums"
        />

        <AlbumList
            v-if="newAlbums.length"
            title="Nouveautés Rock"
            :albums="newAlbums"
        />

        <AlbumList
            v-if="userStore.favorites.length"
            title="Favoris"
            :albums="userStore.favorites"
            :showAllLink="true"
            allLinkPath="/favoris"
        />

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
import AlbumList from '@/components/AlbumList.vue'

const userStore = useUserStore()
const searchTerm = ref('')
const albums = ref([])
const newAlbums = ref([])
const newPopularAlbums = ref([])
const router = useRouter()
const favoritesList = ref(null)

onMounted(() => {
    searchNewAlbum()
    searchNewPopularAlbum()
    console.log('newAlbums', newAlbums)
    userStore.fetchReviewsFromApi()

})


const searchNewAlbum = async () => { 
    const token = userStore.spotifyToken
    const res = await fetch(`https://api.spotify.com/v1/search?q=genre:"rock"&type=album`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    
    const data = await res.json()
    console.log('data', data)
    newAlbums.value = data.albums.items
}

const searchNewPopularAlbum = async () => { 
    const token = userStore.spotifyToken
    const res = await fetch(`https://api.spotify.com/v1/browse/new-releases`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    
    const data = await res.json()
    console.log('searchNewPopularAlbum', data)
    newPopularAlbums.value = data.albums.items
}

function scrollFavorites(direction) {
  const el = favoritesList.value
  const scrollAmount = 600 // Adjust as needed
  if (direction === 'left') {
    el.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  } else {
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}
</script>

<style scoped>

.home-container {
  text-align: center;
  margin: 0 auto;
  width: 80%;
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
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
}

.favorites-list h3 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.favorites-list::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Webkit */
}

.favorite-album img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.favorite-album img:hover {
  transform: scale(1.05);
}

.favorite-album {
    max-width: 200px;
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

  .favorites-section {
  border-top: none;
  }

  h1 {
    font-size: 1.5rem;
  }

  h4 {
    font-size: 1rem;
  }
}

.favorites-list-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: rgba(44, 44, 44, 0.7);
  color: white;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 10px;
  border-radius: 50%;
  pointer-events: none;
}

.arrow.left {
  left: 0;
}
.arrow.right {
  right: 0;
}

.favorites-list-wrapper:hover .arrow {
  opacity: 1;
  pointer-events: auto;
}
</style>