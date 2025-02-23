<template>
  <div
    v-if="!isAuthenticated"
    class="min-h-screen flex items-center justify-center bg-[#231F20] bg-[url('./assets/background-pattern.svg')] bg-cover bg-center"
  >
    <!-- Login Box -->
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <!-- Logo Section -->
      <div class="flex justify-center mb-6">
        <img
          src="./assets/trailspur-logo.svg"
          alt="Trailspur Logo"
          class="w-48 h-auto"
        />
      </div>
      <p class="text-center text-gray-600 mb-8">
        Welcome back! Please sign in to continue.
      </p>

      <!-- Login Form -->
      <form @submit.prevent="login" class="space-y-6">
        <!-- Email Input -->
        <div class="relative">
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Email"
            required
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#967444] focus:border-transparent outline-none"
          />
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          </span>
        </div>

        <!-- Password Input -->
        <div class="relative">
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Password"
            required
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#967444] focus:border-transparent outline-none"
          />
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </span>
        </div>

        <!-- Remember Me -->
        <div class="flex items-center justify-between">
          <a href="#" class="text-sm text-[#967444] hover:underline"
            >Forgot Password?</a
          >
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-gradient-to-r from-[#967444] to-[#7a5c36] text-white py-2 px-4 rounded-lg hover:from-[#7a5c36] hover:to-[#967444] transition duration-300 flex items-center justify-center"
        >
          <span v-if="isLoading">
            <svg
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
          <span v-else>Login</span>
        </button>

        <!-- Error Message -->
        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

      </form>
    </div>
  </div>
  <div v-else>
    <RouterView />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, RouterView } from "vue-router";
import { supabase } from "./lib/supabase";

const email = ref("");
const password = ref("");
const error = ref(null);
const isAuthenticated = ref(false);
const router = useRouter();

// Check authentication state on component mount
onMounted(async () => {
  try {
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError) {
      console.error("Error fetching session:", authError.message);
      isAuthenticated.value = false; // Assume user is not authenticated
      return;
    }
    if (session) {
      isAuthenticated.value = true; // User is authenticated
      if (session && !error && window.location.pathname === "/") {
        // If the user is authenticated and on the root path, redirect to '/home'
        router.push("/home");
      }
    } else {
      isAuthenticated.value = false; // User is not authenticated
      router.push("/");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    isAuthenticated.value = false; // Assume user is not authenticated
  }
});

async function login() {
  try {
    const { user, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (loginError) {
      error.value = loginError.message;
    } else {
      isAuthenticated.value = true; // Update the authentication state
      router.push("/home"); // Redirect to home
    }
  } catch (err) {
    error.value = err.message; // Assign error properly
    console.error("Login error", err);
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
