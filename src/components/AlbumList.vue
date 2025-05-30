<template>
    <div class="favorites-section">
        <div class="favorites-header">
            <h2>{{ title }}</h2>
            <router-link v-if="showAllLink" :to="allLinkPath" class="all-link">Voir tout</router-link>
        </div>
        <div class="favorites-list-wrapper">
            <button class="arrow left" @click="scrollFavorites('left')">&#8592;</button>
            <div class="favorites-list" ref="favoritesList">
                <router-link
                    v-for="album in albums"
                    :key="album.id"
                    :to="`/album/${album.id}`"
                    class="favorite-album"
                >
                    <img :src="album.images?.[0]?.url" />
                    <h3>{{album.name}}</h3>
                    <p>{{album.artists[0].name}}</p>
                </router-link>
            </div>
            <button class="arrow right" @click="scrollFavorites('right')">&#8594;</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    albums: {
        type: Array,
        required: true
    },
    showAllLink: {
        type: Boolean,
        default: false
    },
    allLinkPath: {
        type: String,
        default: ''
    }
})

const favoritesList = ref(null)

function scrollFavorites(direction) {
    const el = favoritesList.value
    const scrollAmount = 600
    if (direction === 'left') {
        el.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    } else {
        el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
}
</script>

<style scoped>
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
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.favorites-list h3 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.favorites-list::-webkit-scrollbar {
    display: none;
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

@media (max-width: 768px) {
    .favorites-section {
        border-top: none;
    }

    .favorite-album img {
    width: 20vw;
    height: 20vh;
    }

    .favorite-album img:hover {
        transform: scale(1.05);
    }

    .favorite-album {
        max-width: 20vw;
        margin-right: 20px;
    }
}
</style> 