import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router' // <-- ceci

const app = createApp(App)
app.use(createPinia())
app.use(router) // <-- et ceci
app.mount('#app')