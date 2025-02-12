import HomePage from "../components/HomePage.vue";
import { createRouter, createWebHistory } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";
import App from '../App.vue'
import ApraisalDistrict from '../components/ApraisalDistrict.vue';
import AcquisitionList from '../components/AcquisitionList.vue';
import LightIndustrialMT from "../AcquisitionComponents/LightIndustrialMT.vue";
import LightIndustrialUB from "../AcquisitionComponents/LightIndustrialUB.vue";
import IOSExsisting from "../AcquisitionComponents/IOSExsisting.vue";
import IOSDevelopment from "../AcquisitionComponents/IOSDevelopment.vue";
import View from "../components/View.vue";
import Tarrant from "../components/AppraisalDistrict/TarrantCounty.vue";

const routes = [
  {
    path: '/',
    name: 'base',
    component: App,
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/appraisaldistrict',
    name: 'Appraisal District',
    component: ApraisalDistrict,
  },
  {
    path: '/appraisaldistrict/tarrant',
    name: 'Tarrant County',
    component: Tarrant,
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
  {
    path: '/view',
    name: 'View',
    component: View,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth0 = useAuth0();
  const isAuthenticated = auth0.isAuthenticated.value;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/"); // Redirect to login if not authenticated
  } else {
    next();
  }
});

export default router