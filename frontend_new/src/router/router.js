import HomePage from "../components/HomePage.vue";
import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "../lib/supabase";
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
    meta: { requiresAuth : true }
  },
  {
    path: '/appraisaldistrict',
    name: 'Appraisal District',
    component: ApraisalDistrict,
    meta: { requiresAuth : true }
  },
  {
    path: '/appraisaldistrict/tarrant',
    name: 'Tarrant County',
    component: Tarrant,
    meta: { requiresAuth : true }
  },
  {
    path: '/acquisitionlist',
    name: 'Acquisition List',
    component: AcquisitionList,
    meta: { requiresAuth : true }
  },
  {
    path: '/acquisition-list/LightIndustrialMT',
    name: 'Light Industrial Multi Tenant',
    component: LightIndustrialMT,
    meta: { requiresAuth : true }
  },
  {
    path: '/acquisition-list/LightIndustrialUB',
    name: 'Light Industrial User Building',
    component: LightIndustrialUB,
    meta: { requiresAuth : true }
  },
  {
    path: '/acquisition-list/IOSExsiting',
    name: 'IOS Existing',
    component: IOSExsisting,
    meta: { requiresAuth : true }
  },
  {
    path: '/acquisition-list/IOSDevelopment',
    name: 'IOS Development',
    component: IOSDevelopment,
    meta: { requiresAuth : true }
  },
  {
    path: '/view',
    name: 'View',
    component: View,
    meta: { requiresAuth : true }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    // Get the current session from Supabase
    const { data: { session }, error } = await supabase.auth.getSession();

    if (!session || error) {
      // If no session or error, redirect to the root route
      next({ path: '/' });
    } else {
      // If authenticated, allow navigation
      next();
    }
  } else {
    // If the route does not require authentication, allow navigation
    next();
  }
});
export default router;