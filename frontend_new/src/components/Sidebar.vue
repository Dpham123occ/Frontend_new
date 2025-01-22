<template>
  <div class="sidebar">
    <!-- Logo Section -->
    <div class="logo-section">
      <img src="../assets/TSBlack.png" alt="Trailspur Logo" class="logo" />
    </div>

    <nav class="nav-menu">
      <router-link to="/appraisaldistrict" class="nav-item">Appraisal District</router-link>
      <router-link to="/acquisitionlist" class="nav-item">Acquisition List</router-link>
      <router-link to="/view" class="nav-item">View Reports</router-link>
      <router-link to="/settings" class="nav-item">Settings</router-link>
      <!-- Conditional Button -->
      <button
        v-if="isHomePage"
        class="nav-item logout-button"
        @click="logOut"
      >
        Log Out
      </button>
      <button
        v-else
        class="nav-item back-button"
        @click="goBack"
      >
        Back
      </button>
    </nav>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';

export default {
  name: 'Sidebar',
  setup() {
    const { logout } = useAuth0();
    const route = useRoute();
    const router = useRouter();

    // Check if the current route is the home page
    const isHomePage = route.path === '/home';

    const logOut = () => {
      logout({ returnTo: window.location.origin });
    };

    const goBack = () => {
      router.back();
    };

    return { isHomePage, logOut, goBack };
  },
};
</script>

<style scoped>
/* Sidebar styling */
.sidebar {
  width: 220px;
  background-color: #d1dede;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  height: 100vh;
}

.logo-section {
  margin-bottom: 2rem;
}

.logo {
  width: 140px;
  height: auto;
  object-fit: contain;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.nav-item {
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: none;
  color: #231f20;
  text-align: left;
  font-weight: bold;
  font-family: 'Brother 1816 Reg', sans-serif;
  cursor: pointer;
  width: calc(100% - 2rem);
  border-radius: 5px;
  margin-bottom: 1rem;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: #d8d2c4;
}

.back-button {
  margin-top: 2rem;
  background-color: #231f20;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  width: calc(100% - 2rem);
  cursor: pointer;
}

.back-button:hover {
  background-color: #000;
}

.logout-button {
  margin-top: 2rem;
  background-color: #231f20;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  width: calc(100% - 2rem);
  cursor: pointer;
}

.logout-button:hover {
  background-color: #000;
}
</style>
