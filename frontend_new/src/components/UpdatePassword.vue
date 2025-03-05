<template>
  <div>
    <div class="max-w-md mx-auto p-8 text-center">
      <h1 class="text-2xl font-bold mb-6 text-gray-800">Update Password</h1>

      <!-- New Password Input -->
      <div class="mb-4 text-left">
        <label for="new-password" class="block font-medium text-gray-700 mb-2">
          New Password
        </label>
        <input v-model="newPassword" type="password" id="new-password" placeholder="Enter your new password" required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#967444]" />
      </div>

      <!-- Confirm New Password Input -->
      <div class="mb-6 text-left">
        <label for="confirm-password" class="block font-medium text-gray-700 mb-2">
          Confirm New Password
        </label>
        <input v-model="confirmPassword" type="password" id="confirm-password" placeholder="Confirm your new password"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#967444]" />
      </div>

      <!-- Update Password Button -->
      <button @click="updatePassword"
        class="w-full bg-[#967444] text-white py-2 px-4 rounded-md hover:bg-[#7a5c36] transition-colors">
        Update Password
      </button>

      <!-- Success Message -->
      <p v-if="successMessage" class="mt-4 text-green-600 text-sm">
        {{ successMessage }}
      </p>

      <!-- Error Message -->
      <p v-if="error" class="mt-4 text-red-500 text-sm">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";
import { useRouter } from "vue-router";

export default {
  name: "UpdatePassword",
  setup() {
    const newPassword = ref("");
    const confirmPassword = ref("");
    const successMessage = ref("");
    const error = ref("");
    const router = useRouter();

    // Listen for the PASSWORD_RECOVERY event
    onMounted(() => {
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          // The user has clicked the reset link and is redirected here
          // You can now prompt them to update their password
          console.log("PASSWORD_RECOVERY event detected");
        }
      });
    });

    // Update Password Function
    const updatePassword = async () => {
      try {
        if (!newPassword.value || !confirmPassword.value) {
          error.value = "Please fill in all fields.";
          return;
        }

        if (newPassword.value !== confirmPassword.value) {
          error.value = "Passwords do not match.";
          return;
        }

        // Update the user's password
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword.value,
        });

        if (updateError) throw updateError;

        // Show success message
        successMessage.value = "Password updated successfully!";
        error.value = ""; // Clear any previous error

        // Redirect to home page after a short delay
        if (router.currentRoute.value.path === "/update-password") {
          setTimeout(() => {
            supabase.auth.signOut();
            router.push("/");
          }, 2000);
        }

      } catch (err) {
        console.error("Error updating password:", err.message);
        alert("Error updating password: " + err.message);
        error.value = "Failed to update password. Please try again.";
        successMessage.value = ""; // Clear any previous success message
      }
    };

    return {
      newPassword,
      confirmPassword,
      successMessage,
      error,
      updatePassword,
    };
  },
};
</script>
