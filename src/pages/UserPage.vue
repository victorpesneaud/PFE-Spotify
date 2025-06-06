<template>
  <div class="user-page">
    <div class="user-container">
      <div class="user-info">
        <h1>User Profile</h1>
        <div class="profile-details">
          <p><strong>Name:</strong> {{ userStore.user?.name }}</p>
          <p><strong>Email:</strong> {{ userStore.user?.email }}</p>
          <p  @click="handleLogout"><strong>Logout</strong></p>
        </div>
      </div>

      <div class="favorites-section" v-if="userStore.favorites.length">
        <h2>Favorite Albums</h2>
        <div class="favorites-grid">
          <router-link 
            v-for="album in userStore.favorites" 
            :key="album.id"
            :to="`/album/${album.id}`"
            class="favorite-card"
          >
            <img :src="album.images[0]?.url" :alt="album.name" class="album-cover" />
            <div class="album-info">
              <h3>{{ album.name }}</h3>
              <p>{{ album.artists[0].name }}</p>
            </div>
          </router-link>
        </div>
      </div>

      <div class="reviews-section" v-if="userStore.reviews.length">
        <h2>Recent Reviews</h2>
        <div class="reviews-list">
          <div v-for="review in userStore.reviews.slice(0, 5)" :key="review.id" class="review-card">
            <div class="review-main">
              <img :src="review.albumInfo?.imageUrl" alt="album cover" class="album-cover-reviews">
              <div class="review-details">
                <router-link
                  :to="`/album/${review.albumId}`"
                  class="review-title-link"
                >
                  <h3 class="review-title">{{ review.albumInfo?.title || getAlbumName(review.albumId) }}</h3>
                </router-link>
                <p class="review-comment">{{ review.comment }}</p>
              </div>
              <div class="rating">
                {{ "⭐".repeat(review.rating) }}
              </div>
            </div>
            <div class="review-footer">
              <small>{{ formatDate(review.timestamp) }}</small>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!userStore.favorites.length && !reviews.length" class="empty-state">
        <p>No favorites or reviews yet. Start exploring albums to add some!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'


const userStore = useUserStore()
const albumNames = ref({})
const reviews = ref([])
const isLoading = ref(true)
const router = useRouter()

onMounted(async () => {
  userStore.fetchReviewsFromApi()
  // Fetch album names for reviews
  for (const review of userStore.reviews) {
    console.log('review', review)
    if (!albumNames.value[review.albumId]) {
      try {
        const albumResponse = await fetch(`https://api.spotify.com/v1/albums/${review.albumId}`, {
          headers: {
            'Authorization': `Bearer ${userStore.spotifyToken}`
          }
        })
        if (albumResponse.ok) {
          const albumData = await albumResponse.json()
          console.log('albumData', albumData)
          albumNames.value[review.albumId] = albumData.name
        }
      } catch (error) {
        console.error('Error fetching album:', error)
      }
    }
  }
  console.log('albumNames', albumNames)
  isLoading.value = false
})

const getAlbumName = (albumId) => {
  return albumNames.value[albumId] || 'Unknown Album'
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.user-page {
  padding: 6rem 2rem 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #2d1b69 0%, #462985 100%);
}

.user-container {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  color: white;
}

h1 {
  margin-bottom: 2rem;
  font-size: 2rem;
}

.profile-details {
  margin-bottom: 3rem;
}

.profile-details p {
  margin: 1rem 0;
  font-size: 1.1rem;
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.favorite-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
  text-decoration: none;
  color: white;
}

.favorite-card:hover {
  transform: translateY(-2px);
}

.album-cover {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.album-cover-reviews {
  width: 150px;
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

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.review-card:hover {
  transform: translateY(-2px);
}

.review-main {
  display: flex;
  align-items: top;
  gap: 1.5rem;
  justify-content: space-between;
}

.review-details {
  display: flex;
  flex-direction: column;
  justify-content: top;
  flex: 1;
}

.review-title {
  color: #1db954;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.review-comment {
  margin: 0;
  line-height: 1.5;
}

.rating {
  color: #ffd700;
  font-size: 1.2rem;
  min-width: 90px; /* adjust as needed for alignment */
  text-align: right;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

small {
  color: rgba(255, 255, 255, 0.6);
}

.view-album {
  color: #1db954;
  text-decoration: none;
  font-size: 0.9rem;
}

.view-album:hover {
  text-decoration: underline;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .user-container {
    padding: 1.5rem;
  }
}
</style> 