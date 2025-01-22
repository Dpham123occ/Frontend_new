<template>
  <div class="home">
    <Sidebar></Sidebar>
  </div>
  
</template>

<script>
import Sidebar from './Sidebar.vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'HomePage',
  components: {
    Sidebar,
  },
  setup() {
    const { handleRedirectCallback } = useAuth0();
    const route = useRoute();

    onMounted(async () => {
      if (route.query.code && route.query.state) {
        // Auth0 handles the callback and completes login
        await handleRedirectCallback();
      }
    });
  },
};
</script>
