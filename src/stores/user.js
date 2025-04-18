import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || '',
    spotifyToken: localStorage.getItem('spotifyToken') || '',
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    reviews: JSON.parse(localStorage.getItem('reviews')) || []
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    recentReviews: (state) => [...state.reviews].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5)
  },

  actions: {
    async login(email, password) {
      try {
        // Login to our backend
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Login failed');
        }

        const { user, token } = await response.json();

        // Store user data and token
        this.user = user;
        this.token = token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        // Get Spotify API token
        await this.getSpotifyToken();

        return true;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    async register(userData) {
      try {
        const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Registration failed');
        }

        const { user, token } = await response.json();

        // Store user data and token
        this.user = user;
        this.token = token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        // Get Spotify API token
        await this.getSpotifyToken();

        return true;
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },

    async getSpotifyToken() {
      try {
        const clientId = '9233dcaa945e40d3a57be6a298733565'
        const clientSecret = '3f676c5bb59f41afb1871f4537924309'
        const credentials = btoa(`${clientId}:${clientSecret}`)

        const res = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`
          },
          body: 'grant_type=client_credentials'
        })

        if (!res.ok) {
          throw new Error('Failed to get Spotify token');
        }

        const data = await res.json();
        this.spotifyToken = data.access_token;
        localStorage.setItem('spotifyToken', data.access_token);
        return data.access_token;
      } catch (error) {
        console.error('Spotify token error:', error);
        throw error;
      }
    },

    logout() {
      this.user = null
      this.token = ''
      this.spotifyToken = ''
      this.favorites = []
      this.reviews = []
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('spotifyToken')
      localStorage.removeItem('favorites')
      localStorage.removeItem('reviews')
    },

    toggleFavorite(album) {
      const exists = this.favorites.find(a => a.id === album.id)
      if (exists) {
        this.favorites = this.favorites.filter(a => a.id !== album.id)
      } else {
        this.favorites.push(album)
      }
      localStorage.setItem('favorites', JSON.stringify(this.favorites))
    },

    isFavorite(albumId) {
      return this.favorites.some(a => a.id === albumId)
    },

    addReview(albumId, rating, comment) {
      const review = {
        id: Date.now().toString(),
        albumId,
        rating,
        comment,
        timestamp: new Date().toISOString()
      }
      this.reviews.push(review)
      localStorage.setItem('reviews', JSON.stringify(this.reviews))
      return review
    },

    getAlbumReviews(albumId) {
      return this.reviews.filter(review => review.albumId === albumId)
    },

    getRecentReviews(limit = 5) {
      return [...this.reviews].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit)
    }
  }
})