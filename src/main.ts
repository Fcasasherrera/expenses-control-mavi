import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Esto busca automáticamente el index.ts en la carpeta router
import './style.css'

const app = createApp(App)

app.use(router) // <--- ¡ESTA LÍNEA ES LA CLAVE! Sin esto, el router no carga
app.mount('#app')