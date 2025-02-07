<template>
  <div class="sidebar-container">
    <!-- Logo Section -->
    <div class="logo-section">
      <router-link to="/home">
        <img src="../assets/TSBlack.png" alt="Trailspur Logo" class="logo" />
      </router-link>
    </div>
    <nav class="nav-menu">
      <router-link to="/appraisaldistrict" class="nav-item">
        Appraisal District
      </router-link>
      <router-link to="/acquisitionlist" class="nav-item">
        Acquisition List
      </router-link>
      <router-link to="/view" class="nav-item">
        View Reports
      </router-link>
      <router-link to="/settings" class="nav-item">
        Settings
      </router-link>

      <!-- Conditional Buttons -->
      <button v-if="isHomePage" class="nav-item logout-button" @click="logOut">

        Log Out
      </button>
      <button v-else class="nav-item back-button" @click="goBack">
        Back
      </button>
    </nav>
  </div>
</template>

<script>
import { useAuth0 } from '@auth0/auth0-vue';

import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'Sidebar',
  setup() {
    const { logout } = useAuth0();
    const route = useRoute();
    const router = useRouter();
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
/* Container for the sidebar */
.sidebar-container {
  width: 250px;
  /* or 220px, if you prefer a narrower bar */
  background-color:#d1dde6;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  /* Modern look: subtle shadow + border */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e6e6e6;
  z-index: 999;

  /* Example modern font stack (can use "Brother 1816 Reg" if needed) */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

/* Logo Section */
.logo-section {
  margin-bottom: 2rem;
  text-align: center;
}

.logo {
  width: 200px;
  height: auto;
  object-fit: contain;
}

/* Nav Menu */
.nav-menu {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Shared nav-item styles (works for <router-link> and <button>) */
/* Shared nav-item styles (works for <router-link> and <button>) */
.nav-item {
  display: block;
  width: 100%;
  background-color: transparent;
  border: none;
  color: #231F20;
  text-align: left;
  font-weight: 500;
  font-size: 20px;
  cursor: pointer;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

/* Hover/active state */
.nav-item:hover,
.nav-item:focus {
  background-color: #d6d2c4; /* Changed to the desired color */
  color: #2c3e50;            /* Ensuring the text remains visible */
  transform: scale(1.05);    /* Optional: adds a slight zoom effect like the acquisition list */
}

/* "Back" and "Log Out" are styled similarly but with a darker background */
.back-button,
.logout-button {
  background-color: #2c3e50;
  color: #ffffff;
  margin-top: 1rem;
  text-align: center;
}

.back-button:hover,
.logout-button:hover {
  background-color: #1a252f;
}

</style>
