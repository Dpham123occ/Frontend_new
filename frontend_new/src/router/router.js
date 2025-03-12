import HomePage from "../components/HomePage.vue";
import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "../lib/supabase";
import ApraisalDistrict from '../components/ApraisalDistrict.vue';
import AcquisitionList from '../components/AcquisitionList.vue';
import LightIndustrialMT from "../AcquisitionComponents/LightIndustrialMT.vue";
import LightIndustrialUB from "../AcquisitionComponents/LightIndustrialUB.vue";
import IOSExsisting from "../AcquisitionComponents/IOSExsisting.vue";
import IOSDevelopment from "../AcquisitionComponents/IOSDevelopment.vue";
import View from "../components/View.vue";
import Tarrant from "../components/AppraisalDistrict/TarrantCounty.vue";
import Setting from "../components/Setting.vue";
import ForgotPassword from '../components/ForgotPassword.vue';
import UpdatePassword from '../components/UpdatePassword.vue';
import LoginPage from "../components/LoginPage.vue";
import View2 from "../components/View2.vue";
const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage,
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
    path: '/acquisition-list/IOSExisting',
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
    component: View2,
    meta: { requiresAuth : true }
  },
  {
    path: '/settings',
    name: 'Setting',
    component: Setting,
    meta: { requiresAuth : true }  
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  {
    path: '/update-password',
    name: 'UpdatePassword',
    component: UpdatePassword,
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
  } else if (to.path === '/') {
    // Check if the user is on the root path
    const { data: { session }, error } = await supabase.auth.getSession();

    if (session && !error) {
      // If the user is authenticated and on the root path, redirect to '/home'
      next({ path: '/home' });
    } else {
      // If the user is not authenticated, allow navigation to the root path
      next();
    }
  } else {
    // If the route does not require authentication, allow navigation
    next();
  }
});

export default router;