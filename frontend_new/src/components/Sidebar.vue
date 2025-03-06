<template>
  <div>
    <!-- Hamburger Button -->
    <button @click="toggleSidebar" class="hamburger-btn">
      <span :class="{ open: isSidebarOpen }">&#9776;</span>
    </button>

    <!-- Sidebar -->
    <div :class="['sidebar-container', { open: isSidebarOpen }]">
      <!-- Logo Section -->
      <div class="logo-section">
        <router-link to="/home">
          <img
            src="../assets/trailspur-logo.svg"
            alt="Trailspur Logo"
            class="logo"
          />
        </router-link>
      </div>

      <!-- Navigation Menu -->
      <nav class="nav-menu">
        <router-link
          to="/appraisaldistrict"
          class="nav-item"
          @click="closeSidebar"
        >
          Appraisal District
        </router-link>
        <router-link
          to="/acquisitionlist"
          class="nav-item"
          @click="closeSidebar"
        >
          Acquisition List
        </router-link>
        <router-link to="/view" class="nav-item" @click="closeSidebar">
          View Reports
        </router-link>
        <router-link to="/settings" class="nav-item" @click="closeSidebar">
          Settings
        </router-link>

        <!-- Conditional Buttons -->
        <button
          v-if="isHomePage"
          class="nav-item logout-button"
          @click="logOut"
        >
          Log Out
        </button>
        <button v-else class="nav-item back-button" @click="goBack">
          Back
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, defineEmits } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "../lib/supabase";

export default {
  name: "Sidebar",
  setup(_, { emit }) {
    const route = useRoute();
    const router = useRouter();
    const isHomePage = route.path === "/home";

    const isSidebarOpen = ref(true);

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
      emit("sidebarToggle", isSidebarOpen.value); // Notify parent component
    };

    const closeSidebar = () => {
      isSidebarOpen.value = false;
      emit("sidebarToggle", false);
    };

    const logOut = async () => {
      try {
        // Check if a valid session exists
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!session || sessionError) {
          console.warn(
            "No active session found. Clearing local state and redirecting to login."
          );
          // Clear local storage
          localStorage.removeItem(`sb-${supabaseUrl.split(".")[0]}-auth-token`);
          // Redirect to login page
          router.push("/");
          return;
        }

        // Sign out the user
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // Redirect to the login page after logout
        router.push("/");
      } catch (err) {
        console.error("Error logging out:", err.message);
        // Redirect to login page even if there's an error
        router.push("/");
      }
    };

    // Listen for authentication state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        router.push("/");
      }
    });

    const goBack = () => {
      router.back();
    };

    return {
      isHomePage,
      logOut,
      goBack,
      isSidebarOpen,
      toggleSidebar,
      closeSidebar,
    };
  },
};
</script>

<style scoped>
/* Sidebar Styles */
.sidebar-container {
  width: 250px;
  background-color: #231f20;
  height: 100vh;
  position: fixed;
  top: 0;
  left: -250px; /* Initially hidden */
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e6e6e6;
  z-index: 999;
  transition: left 0.3s ease-in-out;
}

/* Sidebar Open State */
.sidebar-container.open {
  left: 0;
}

/* Hamburger Button */
.hamburger-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  z-index: 1000;
  color: #967444;
}

/* Animate Hamburger Icon */
.hamburger-btn span {
  transition: transform 0.3s ease-in-out;
}

.hamburger-btn span.open {
  transform: rotate(90deg); /* Rotate when sidebar is open */
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

.nav-item {
  display: block;
  width: 100%;
  background-color: transparent;
  border: none;
  color: #ffffff;
  text-align: left;
  font-weight: 500;
  font-size: 20px;
  font-family: "Sentinel – Book Aa", serif;
  cursor: pointer;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.nav-item:hover {
  background-color: #967444;
  transform: scale(1.05);
}

.back-button,
.logout-button {
  background-color: #231f20;
  color: #ffffff;
  margin-top: 1rem;
  text-align: center;
}

.back-button:hover,
.logout-button:hover {
  background-color: #000000;
  color: #ffffff !important;
}
</style>
