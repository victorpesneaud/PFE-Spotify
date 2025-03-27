<template>
    <div class="album-container" v-if="album">
        <a :href="album.external_urls.spotify" target="_blank">
            <img :src="album.images[0]?.url" class="album-cover" />
        </a>
      <div class="album-details">
        <a :href="album.external_urls.spotify" target="_blank">
            <h1>{{ album.name }}</h1>
        </a>
        <p><strong>Artiste(s) :</strong> {{ album.artists.map(a => a.name).join(', ') }}</p>
        <p><strong>Date de sortie :</strong> {{ album.release_date }}</p>
        <p><strong>Total de pistes :</strong> {{ album.total_tracks }}</p>
        <button @click="toggleFavorite" class="fav-btn">
            {{ isFavorited ? 'Retirer des favoris ❤️' : 'Ajouter aux favoris 🤍' }}
        </button>

        <div class="tracks-section">
            <h2>Liste des morceaux</h2>
            <ol>
                <li v-for="track in album.tracks.items" :key="track.id">
                {{ track.name }}
                </li>
            </ol>
        </div>
  
        <div class="rating-section">
          <h2>Votre note</h2>
          <p>⭐⭐⭐⭐⭐</p>
          <small>(Fonctionnalité à venir)</small>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { computed } from 'vue'
  
  const route = useRoute()
  const userStore = useUserStore()
  const album = ref(null)
  const isFav = computed(() => userStore.isFavorite(album.value?.id))
  const isFavorited = computed(() =>
  album.value ? userStore.favorites.some(a => a.id === album.value.id) : false
)
  
  onMounted(async () => {
    const albumId = route.params.name
    const token = userStore.token
  
    const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  
    const data = await res.json()
    console.log("données album :D",data)
    album.value = data
    })

    const toggleFavorite = () => {
        if (album.value) {
            userStore.toggleFavorite(album.value)
        }
    }
  </script>
  
  <style scoped>
  .album-container {
    display: flex;
    gap: 2rem;
    padding: 2rem;
  }
  
  .album-cover {
    width: 300px;
    height: 300px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .album-details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .rating-section {
    margin-top: 2rem;
    padding: 1rem;
    border-top: 1px solid #ddd;
  }

  .fav-btn {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        font-weight: bold;
        background-color: #1db954;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    }

    .fav-btn:hover {
        opacity: 0.9;
    }
  </style>