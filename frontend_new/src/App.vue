<template>
  <div v-if="!isAuthenticated">
    <div class="login-container">
      <div class="login-box">
        <div class="logo-section">
          <img src="./assets/trailspur-logo.svg" alt="Trailspur Logo" class="logo" />
        </div>
        <!-- Login form -->
        <form @submit.prevent="login" class="form-section">
          <input v-model="email" type="email" placeholder="Email" required />
          <input v-model="password" type="password" placeholder="Password" required />
          <button class="btn" type="submit">Login</button>
          <p v-if="error">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
  <div v-else>
    <RouterView />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, RouterView } from 'vue-router';
import { supabase } from './lib/supabase';

const email = ref('');
const password = ref('');
const error = ref(null);
const isAuthenticated = ref(false);
const router = useRouter();

// Check authentication state on component mount
onMounted(async () => {
  const { data: { session }, error: authError } = await supabase.auth.getSession();

  if (session) {
    isAuthenticated.value = true; // User is authenticated
    if(router.currentRoute ==='/') {
      router.push('/home')
    }
  } else {
    isAuthenticated.value = false; // User is not authenticated
  }
});

async function login() {
  try {
    const { user, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });

    if (loginError) {
      error.value = loginError.message;
    } else {
      isAuthenticated.value = true; // Update the authentication state
      router.push('/home'); // Redirect to home
    }
  } catch (err) {
    error.value = err.message; // Assign error properly
    console.error('Login error', err);
  }
}
</script>

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
