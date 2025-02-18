import {createAuth0} from "@auth0/auth0-vue";
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router/router";
import { createClient } from '@supabase/supabase-js';

const app = createApp(App)

app
.use(router)
.use(
    createAuth0({
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL,
      }
    })
);

app.mount('#app');
