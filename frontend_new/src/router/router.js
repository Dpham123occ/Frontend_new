import HomePage from "../components/HomePage.vue";
import { createRouter, createWebHistory } from "vue-router";
import App from '../App.vue'
import ApraisalDistrict from '../components/ApraisalDistrict.vue';
import AcquisitionList from '../components/AcquisitionList.vue';
import LightIndustrialMT from "../AcquisitionComponents/LightIndustrialMT.vue";
import LightIndustrialUB from "../AcquisitionComponents/LightIndustrialUB.vue";
import IOSExsisting from "../AcquisitionComponents/IOSExsisting.vue";
import IOSDevelopment from "../AcquisitionComponents/IOSDevelopment.vue";
import View from "../components/View.vue";

const routes = [
  {
    path: '/',
    name: 'base',
    component: App,
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage,
    beforeEnter: async (to, from, next) => {
      if (to.query.code && to.query.state) {
        const { getAccessTokenSilently } = useAuth0()
        try {
          const token = await getAccessTokenSilently({
            code: to.query.code,
            state: to.query.state,
          })
          // Remove the code and state from the URL path
          const cleanPath = to.path
          next({ path: cleanPath, replace: true })
        } catch (error) {
          console.error(error)
          next()
        }
      } else {
        next()
      }
    }
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
  {
    path: '/view',
    name: 'View',
    component: View,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  parseQuery(query) {
    const parsedQuery = {}
    query.split('&').forEach((param) => {
      const [key, value] = param.split('=')
      parsedQuery[key] = value
    })
    return parsedQuery
  },
  stringifyQuery(obj) {
    const params = []
    Object.keys(obj).forEach((key) => {
      params.push(`${key}=${obj[key]}`)
    })
    return params.join('&')
  },
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  async beforeResolve(to, from) {
    if (to.name === 'homeCallback') {
      const { getAccessTokenSilently } = useAuth0()
      const token = await getAccessTokenSilently()
      // Use the token to authenticate the user
      // ...
      // Redirect to the homepage
      await router.push({ name: 'HomePage' })
    }
  }
})

export default router