import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);
app.use(router);

// Disable Vue performance tracking in production
if (import.meta.env.PROD) {
  app.config.performance = false;
}

app.mount('#app');
