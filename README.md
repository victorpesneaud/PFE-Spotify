# spotifind

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup


## Project Setup

```sh
cd spotifind
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
### Compile and Minify for Production

un dossier .env doit être demandé pour faire tourner le backend
```sh
cd backend
npm install -g nodemon
npm install dotenv
npm run dev 
```



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