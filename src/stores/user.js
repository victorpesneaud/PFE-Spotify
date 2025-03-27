import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    email: '',
    password: '',
    token: '', 
    storedEmail: 'test@spotify.com',
    storedPassword: '123456',
    prenom: 'Victor',
    favorites: JSON.parse(localStorage.getItem('favorites')) || []
  }),
    getters: {
        isAuthenticated: (state) => !!state.token
    },
    actions: {
        async login(email, password) {
        if (email === this.storedEmail && password === this.storedPassword) {
            this.email = email
            this.password = password

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
                console.error('Erreur lors de la récupération du token Spotify')
                const errorText = await res.text()
                console.error('Détail de l’erreur :', errorText)
                return false
            }
            
            const data = await res.json()
            console.log('Réponse Spotify:', data)
            this.token = data.access_token

            return true
        }

        return false
        },
    logout() {
      this.email = ''
      this.password = ''
      this.token = ''
    },
    toggleFavorite(album) {
        const exists = this.favorites.find(a => a.id === album.id)
        if (exists) {
          this.favorites = this.favorites.filter(a => a.id !== album.id)
        } else {
          this.favorites.push(album)
        }
    
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
      },
      isFavorite(albumId) {
        return this.favorites.some(a => a.id === albumId)
      }
  }
})