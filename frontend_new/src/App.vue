<template>
  <html data-theme="coporate">
  <LoginPage msg="Welcome to Trailspur"/>
  </html>
</template>

<script setup>
  import LoginPage from './components/LoginPage.vue'
  import { onMounted, watch } from "vue";
  import { useAuth0 } from "@auth0/auth0-vue";
  import { useRouter } from "vue-router";

  const { isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  // Check authentication and redirect if authenticated
  onMounted(() => {
    if (!isLoading.value && isAuthenticated.value) {
      router.replace("/home");
    }
  });

  // Watch for authentication changes
  watch(isAuthenticated, (newValue) => {
    if (newValue && router.currentRoute.value.path === "/" ) {
      router.replace("/home");
    }
  });
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
