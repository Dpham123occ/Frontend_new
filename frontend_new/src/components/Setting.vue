<template>
    <div class="profile-container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-spinner">
        Loading...
      </div>
  
      <!-- Profile Information -->
      <div v-else class="profile-info">
        <h1 class="profile-title">Profile</h1>
        <div class="profile-detail">
          <strong>UID:</strong> {{ user?.id }}
        </div>
        <div class="profile-detail">
          <strong>Email:</strong> {{ user?.email }}
        </div>
      </div>
  
      <!-- Error Message -->
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { supabase } from '../lib/supabase';
  
  export default {
    name: 'Setting',
    setup() {
      const user = ref(null); // Store the user's information
      const isLoading = ref(true); // Loading state
      const error = ref(null); // Error message
      const router = useRouter();
  
      // Fetch the current user's information
      const fetchUserProfile = async () => {
        try {
          const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
  
          if (userError) throw userError;
  
          if (!currentUser) {
            // If no user is found, redirect to the login page
            router.push('/');
            return;
          }
  
          // Set the user's information
          user.value = currentUser;
        } catch (err) {
          console.error('Error fetching user profile:', err.message);
          error.value = 'Failed to fetch profile information.';
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
  
  <style scoped>
  .profile-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }
  
  .loading-spinner {
    font-size: 1.2rem;
    color: #666;
  }
  
  .profile-info {
    background-color: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .profile-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .profile-detail {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: #555;
  }
  
  .error-message {
    color: #ff4d4f;
    font-size: 1rem;
    margin-top: 1rem;
  }
  </style>