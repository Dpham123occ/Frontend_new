import HomePage from "../components/HomePage.vue";
import {createRouter, createWebHistory} from "vue-router";
import App from '../App.vue'
import ApraisalDistrict from '../components/ApraisalDistrict.vue';
import AcquisitionList from '../components/AcquisitionList.vue';
import LightIndustrialMT from "../AcquisitionComponents/LightIndustrialMT.vue";
import LightIndustrialUB from "../AcquisitionComponents/LightIndustrialUB.vue";
import IOSExsisting from "../AcquisitionComponents/IOSExsisting.vue";
import IOSDevelopment from "../AcquisitionComponents/IOSDevelopment.vue";

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
  },
    
  {
    path: '/acquisition-list/LightIndustrialMT', // Update to match component route
    name: 'Light Industrial Multi Tenant',
    component: LightIndustrialMT,
  },

 {
    path: '/acquisition-list/LightIndustrialUB', // Update to match component route
    name: 'Light Industrial User Building',
    component: LightIndustrialUB,
  },
  {
    path: '/acquisition-list/IOSExsiting', // Update to match component route
    name: 'IOS Exsiting',
    component: IOSExsisting,
  },

    {
    path: '/acquisition-list/IOSDevelopment', // Update to match component route
    name: 'IOS Development',
    component: IOSDevelopment,
  },

];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router