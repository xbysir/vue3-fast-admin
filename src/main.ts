import { createApp } from 'vue';
// import './style.css';
import App from './App.vue';

//router
import router from './router/index';

const app = createApp(App);

app.use(router);
app.mount('#app');
