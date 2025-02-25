<template>
  <div>
    <Sidebar></Sidebar>
    <div class="max-w-2xl mx-auto p-8 text-center">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-gray-600 text-lg">Loading...</div>

      <!-- Profile Information -->
      <div v-else class="bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-3xl font-bold mb-6 text-gray-800">Profile</h1>
        <div class="text-lg mb-4 text-gray-700"><strong>UID:</strong> {{ user?.id }}</div>
        <div class="text-lg mb-4 text-gray-700">
          <strong>Email:</strong> {{ user?.email }}
        </div>
        <UpdatePassword></UpdatePassword>
      </div>
      
      <!-- Error Message -->
      <p v-if="error" class="text-red-500 text-base mt-4">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/supabase";
import Sidebar from "./Sidebar.vue";
import UpdatePassword from "./UpdatePassword.vue";

export default {
  components: { Sidebar, UpdatePassword },
  name: "Setting",
  setup() {
    const user = ref(null); // Store the user's information
    const isLoading = ref(true); // Loading state
    const error = ref(null); // Error message
    const router = useRouter();

    // Fetch the current user's information
    const fetchUserProfile = async () => {
      try {
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!currentUser) {
          // If no user is found, redirect to the login page
          router.push("/");
          return;
        }

        // Set the user's information
        user.value = currentUser;
      } catch (err) {
        console.error("Error fetching user profile:", err.message);
        error.value = "Failed to fetch profile information.";
      } finally {
        isLoading.value = false;
      }
    };

    // Fetch the user's profile when the component mounts
    onMounted(() => {
      fetchUserProfile();
    });

    return {
      user,
      isLoading,
      error,
    };
  },
};
</script>