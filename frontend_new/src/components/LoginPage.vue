<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
const { isAuthenticated } = useAuth0()
import LoginButton from './button/LoginButton.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div v-if="!isAuthenticated">
    <div class="login-container">
      <!-- Centered Container with Logo Inside -->
      <div class="login-box">
        <!-- Logo Section Inside Login Box -->
        <div class="logo-section">
          <img src="../assets/trailspur-logo.svg" alt="Trailspur Logo" class="logo" />
        </div>

        <!-- Login Button Section -->
        <div class="button-section">
          <LoginButton></LoginButton>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
/* Main container */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #d1dede;
  /* texas-sky */
}

/* Centered box */
.login-box {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  /* Stack items vertically */
  align-items: center;
  /* Center the contents horizontally */
}

/* Logo Section Inside Login Box */
.logo-section {
  margin-bottom: 2rem;
  /* Add spacing below the logo */
}

.logo {
  width: 180px;
  height: auto;
  object-fit: contain;
}

/* Login Button Section */
.button-section {
  display: flex;
  justify-content: center;
  /* Center the button */
  width: 100%;
}
</style>
