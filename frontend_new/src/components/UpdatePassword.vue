<template>
  <div>
    <div class="update-password-container">
      <h1 class="update-password-title">Update Password</h1>

      <!-- New Password Input -->
      <div class="input-group">
        <label for="new-password">New Password</label>
        <input
          v-model="newPassword"
          type="password"
          id="new-password"
          placeholder="Enter your new password"
          required
          class="input-field"
        />
      </div>

      <!-- Confirm New Password Input -->
      <div class="input-group">
        <label for="confirm-password">Confirm New Password</label>
        <input
          v-model="confirmPassword"
          type="password"
          id="confirm-password"
          placeholder="Confirm your new password"
          required
          class="input-field"
        />
      </div>

      <!-- Update Password Button -->
      <button @click="updatePassword" class="update-button">
        Update Password
      </button>

      <!-- Success Message -->
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <!-- Error Message -->
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
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

        // Redirect to login page after a short delay
        if (router.currentRoute.value.path === "/update-password") {
          alert(
            "Password updated successfully. You will be redirected to the home page shortly."
          );
          setTimeout(() => {
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

<style scoped>
.update-password-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.update-password-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.update-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #967444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.update-button:hover {
  background-color: #7a5c36;
}

.success-message {
  margin-top: 1rem;
  color: #28a745;
  font-size: 0.9rem;
}

.error-message {
  margin-top: 1rem;
  color: #ff4d4f;
  font-size: 0.9rem;
}
</style>
