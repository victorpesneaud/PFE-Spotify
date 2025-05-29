<template>
    <div class="album-page">
        <div v-if="error" class="error-message">
            {{ error }}
        </div>
        <div class="album-container" v-if="album">
            <div class="album-header">
                <a :href="album.external_urls.spotify" target="_blank">
                    <img :src="album.images[0]?.url" :alt="album.name" class="album-cover" />
                </a>
                <div class="album-info">
                    <h1 class="album-title">{{ album.name }}</h1>
                    <div v-if="meanRating !== null" class="mean-rating">
                        User average rating: {{ meanRating }} / 5
                    </div>
                    <h2 class="artist-name">{{ album.artists.map(a => a.name).join(', ') }}</h2>
                    <p class="album-year">{{ new Date(album.release_date).getFullYear() }}</p>
                    <button 
                        @click="toggleFavorite" 
                        class="favorite-btn"
                        :class="{ 'is-favorite': isFavorited }"
                    >
                        {{ isFavorited ? 'Remove from Favorites' : 'Add to Favorites' }}
                    </button>
                    <a :href="album.external_urls.spotify" target="_blank" class="spotify-button">
                        <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" alt="Listen on Spotify" class="spotify-logo"/>
                        Listen on Spotify
                    </a>
                </div>
            </div>

            <TabSwitcher 
                :tabs="[
                    { id: 'tracks', label: 'Tracks' },
                    { id: 'reviews', label: 'Reviews' }
                ]"
                :initial-tab="activeTab"
                @tab-change="handleTabChange"
            />

            <div v-if="activeTab === 'tracks'" class="tracks-section">
                <div class="tracks-header">
                    <span class="header-title">Title</span>
                    <span class="header-duration">Duration</span>
                </div>
                <div class="tracks-list">
                    <div v-for="(track, index) in album.tracks.items" 
                         :key="track.id" 
                         class="track-item">
                        <div class="track-info">
                            <span class="track-number">{{ index + 1 }}</span>
                            <span class="track-name">{{ track.name }}</span>
                        </div>
                        <span class="track-duration">{{ formatDuration(track.duration_ms) }}</span>
                    </div>
                </div>
            </div>

            <div v-else class="reviews-section">
                <div v-if="userStore.isAuthenticated" class="review-form">
                    <div class="rating-input">
                        <label>Rating:</label>
                        <select v-model="rating" class="rating-select">
                            <option v-for="n in 5" :key="n" :value="n">{{ n }} star{{ n > 1 ? 's' : '' }}</option>
                        </select>
                    </div>
                    <textarea 
                        v-model="newReview" 
                        placeholder="Write your review..."
                        class="review-input"
                    ></textarea>
                    <button @click="submitReview" class="submit-review-btn">Submit Review</button>
                </div>
                <div v-else class="login-prompt">
                    <p>Please <router-link to="/login">login</router-link> to write a review</p>
                </div>
                <div class="reviews-list">
                    <div v-if="reviewsStore.isLoading" class="loading">Loading reviews...</div>
                    <div v-else-if="reviewsStore.error" class="error">{{ reviewsStore.error }}</div>
                    <div v-else-if="reviewsStore.reviews.length === 0" class="no-reviews">
                        No reviews yet. Be the first to review this album!
                    </div>
                    <div v-else class="review-items">
                      <div v-for="review in reviewsStore.reviews" :key="review._id" class="review-item">
                            <div class="review-header">
                                <div class="review-user">
                                    <span class="user-name">{{ review.user?.name || review.userName || 'Unknown user' }}</span>
                                    <div class="review-rating">
                                        <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= review.rating }">
                                            ★
                                        </span>
                                    </div>
                                    <span>{{ review.comment }} </span>
                                </div>
                                <div class="review-actions">
                                    <span class="review-date">{{ new Date(review.createdAt).toLocaleDateString() }}</span>
                                    <span class="review-date">Modifier</span>
                                    <span class="review-date" @click="handleDeleteReview(review._id)">Supprimer</span>
                                </div>
                            </div>
                            <p class="review-content">{{ review.content }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="!error" class="loading">
            Loading...
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useReviewsStore } from '@/stores/reviews'
import TabSwitcher from '@/components/TabSwitcher.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const reviewsStore = useReviewsStore()
const album = ref(null)
const error = ref('')
const activeTab = ref('tracks')
const newReview = ref('')
const rating = ref(5)
const isFavorited = computed(() => {
    return userStore.favorites.some(fav => fav.id === album.value?.id)
})

const meanRating = computed(() => {
  const reviews = reviewsStore.reviews
  if (!reviews || reviews.length === 0) return null
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0)
  return (sum / reviews.length).toFixed(1)
})

onMounted(async () => {
    reviewsStore.reviews = []
    try {
        const albumId = route.params.id
        
        // Check if we have a valid Spotify token
        if (!userStore.spotifyToken) {
            await userStore.getSpotifyToken()
        }

        const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
            headers: {
                'Authorization': `Bearer ${userStore.spotifyToken}`
            }
        })

        if (!res.ok) {
            if (res.status === 401) {
                // Token expired, try to get a new one
                await userStore.getSpotifyToken()
                // Retry the request with new token
                const retryRes = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
                    headers: {
                        'Authorization': `Bearer ${userStore.spotifyToken}`
                    }
                })
                if (!retryRes.ok) {
                    throw new Error('Failed to load album')
                }
                album.value = await retryRes.json()
            } else {
                throw new Error('Failed to load album')
            }
        } else {
            const data = await res.json()
            console.log('Album data received:', data)
            album.value = data
        }

        await reviewsStore.fetchReviews(albumId)

        console.log('Type of reviewsStore.reviews:', typeof reviewsStore.reviews)
        console.log('Is reviewsStore.reviews a ref?', '$value' in reviewsStore.reviews)
        console.log('Raw reviews:', reviewsStore.reviews)
        console.log('Raw reviews.value:', reviewsStore.reviews?.value)
    } catch (err) {
        console.error('Album loading error:', err)
        error.value = 'Failed to load album. Please try again later.'
    }
})


const toggleFavorite = () => {
    if (album.value) {
        userStore.toggleFavorite(album.value)
    }
}

const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
}

const handleTabChange = (tabId) => {
    activeTab.value = tabId
}

const submitReview = async () => {
    if (!newReview.value.trim()) return
    await reviewsStore.addReview(route.params.id, {
        comment: newReview.value,
        rating: rating.value,
        userId: userStore.user.id,
        userName: userStore.user.name,
        timestamp: new Date().toISOString(),
        albumInfo: {
            title: album.value.name,
            imageUrl: album.value.images[0]?.url,
            artists: album.value.artists.map(a => a.name)
        }
    })
    console.log('review added')
    console.log('newReview', newReview.value)
    newReview.value = ''
    rating.value = 5
}

const handleDeleteReview = async (reviewId) => {
    if (confirm('Are you sure you want to delete this review?')) {
        await reviewsStore.deleteReview(reviewId)
    }
}

</script>

<style scoped>
.album-page {
    padding: 2rem;
    min-height: 100vh;
    background: linear-gradient(135deg, #2d1b69 0%, #462985 100%);
    color: white;
}

.album-container {
    max-width: 1200px;
    margin: 0 auto;
}

.album-header {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
}

.album-cover {
    width: 300px;
    height: 300px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.album-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.album-title {
    font-size: 2.5rem;
    margin: 0 0 1rem;
}

.artist-name {
    font-size: 1.5rem;
    color: #b3b3b3;
    margin: 0 0 0.5rem;
}

.album-year {
    font-size: 1rem;
    color: #b3b3b3;
    margin: 0 0 1rem;
}

.favorite-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
    align-self: flex-start;
}

.favorite-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.favorite-btn.is-favorite {
    background: #1db954;
}

.favorite-btn.is-favorite:hover {
    background: #1ed760;
}

.spotify-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: white;
    font-size: 1rem;
    text-decoration: none;
    margin-top: 1rem;
}

.spotify-logo {
    height: 24px;
    width: auto;
}

.tracks-section, .reviews-section {
    margin-top: 2rem;
}

.tracks-header {
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 0.5rem 1rem;
    color: #b3b3b3;
    font-size: 0.9rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 0.5rem;
}

.tracks-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.track-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    transition: background-color 0.2s ease;
}

.track-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.track-info {
    flex: 1;
    display: flex;
    align-items: center;
}

.track-number {
    color: #b3b3b3;
    min-width: 2rem;
}

.track-name {
    font-weight: 500;
}

.track-duration {
    color: #b3b3b3;
}

.review-form {
    margin-bottom: 2rem;
}

.rating-input {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.rating-select {
    padding: 0.5rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.review-input {
    width: 100%;
    min-height: 100px;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    margin-bottom: 1rem;
    resize: vertical;
}

.review-input:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
}

.submit-review-btn {
    background: #1db954;
    border: none;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
}

.submit-review-btn:hover {
    background: #1ed760;
}

.login-prompt {
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    margin-bottom: 2rem;
}

.login-prompt a {
    color: #1db954;
    text-decoration: none;
}

.login-prompt a:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    .album-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .album-cover {
        width: 200px;
        height: 200px;
    }

    .album-info {
        align-items: center;
    }

    .favorite-btn {
        align-self: center;
    }
}

.error-message {
    background: rgba(255, 59, 48, 0.1);
    color: #ff3b30;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
}

.loading {
    color: white;
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
}

.review-items {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.review-item {
    background: rgba(255, 255, 255, 0.05);
    padding: 1.5rem;
    border-radius: 8px;
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.review-user {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.user-name {
    font-weight: 500;
    color: white;
}

.review-rating {
    display: flex;
    gap: 0.25rem;
}

.star {
    color: rgba(207, 204, 38, 1);
}

.star.filled {
    color: #1db954;
}

.review-date {
    color: #b3b3b3;
    font-size: 0.9rem;
}

.review-content {
    color: white;
    line-height: 1.5;
    white-space: pre-wrap;
}

.error {
    color: #ff4b4b;
}

.review-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .review-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .review-date {
        font-size: 0.8rem;
    }
}

.mean-rating {
  font-size: 1.2rem;
  color: #ffd700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>