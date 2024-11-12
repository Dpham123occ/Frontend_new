import HomePage from "../components/HomePage.vue";
import {createRouter, createWebHistory} from "vue-router";
import App from '../App.vue'
import ApraisalDistrict from '../components/ApraisalDistrict.vue';
import AcquisitionList from '../components/AcquisitionList.vue';

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
    },
    {
        path: '/appraisaldistrict',
        name: 'Appraisal District',
        component: ApraisalDistrict,
    },
    {
    path: '/acquisitionlist',
    name: 'Acquisition List',
    component: AcquisitionList,
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router