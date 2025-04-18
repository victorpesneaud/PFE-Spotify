# spotifind

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

un dossier .env doit être demandé pour faire tourner le backend

### List of API Calls 

```sh
POST : http://localhost:5000/api/user/register
POST : http://localhost:5000/api/user/login
GET : http://localhost:5000/api/users/me
POST : http://localhost:5000/api/reviews
GET : http://localhost:5000/api/reviews/albums/:albumId
GET : http://localhost:5000/api/reviews/user/user/:userId
GET : http://localhost:5000/api/reviews/me
PATCH/DELETE : http://localhost:5000/api/reviews/:id
GET : http://localhost:5000/api/reviews/album/:albumId/user
```