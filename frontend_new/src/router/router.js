import HomePage from "../components/HomePage.vue";
import {createRouter, createWebHistory} from "vue-router";
import App from '../App.vue'

const routes = [
    {
      path: '/',
      name: 'base',
      component: App,
    },
    {
      path: '/home',
      name: 'HomePage',
      component: HomePage
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router