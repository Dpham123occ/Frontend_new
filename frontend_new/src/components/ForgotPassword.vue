<template>
  <div class="max-w-md mx-auto p-8 text-center">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Forgot Password</h1>

    <!-- Email Input -->
    <div class="mb-4 text-left">
      <label for="email" class="block font-medium text-gray-700 mb-2"
        >Email</label
      >
      <input
        v-model="email"
        type="email"
        id="email"
        placeholder="Enter your email"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#967444]"
      />
    </div>

    <!-- Send Reset Link Button -->
    <button
      @click="sendResetLink"
      class="w-full bg-[#967444] text-white py-2 px-4 rounded-md hover:bg-[#7a5c36] transition-colors"
    >
      Send Reset Link
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
</template>

<script>
import { ref } from "vue";
import { supabase } from "../lib/supabase";
import { useRouter } from "vue-router";

export default {
  name: "ForgotPassword",
  setup() {
    const email = ref(""); // Store the user's email
    const successMessage = ref(""); // Success message
    const error = ref(""); // Error message
    const router = useRouter();

    // Send Reset Link Function
    const sendResetLink = async () => {
      try {
        if (!email.value) {
          error.value = "Please enter your email address.";
          return;
        }

        // Send password reset email
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email.value,
          {
            redirectTo: "https://trailspurdata.vercel.app/update-password", // Update this URL
          }
        );

        if (resetError) {
          // Check if the error is due to the email not existing
          if (resetError.message.includes("user not found")) {
            error.value = "No account found with this email address.";
          } else {
            throw resetError;
          }
        } else {
          // Show success message
          successMessage.value = "Password reset email sent! Check your inbox.";
          error.value = ""; // Clear any previous error
        }
      } catch (err) {
        console.error("Error sending reset link:", err.message);
        error.value = "Failed to send reset email. Please try again.";
        successMessage.value = ""; // Clear any previous success message
      }
    };

    return {
      email,
      successMessage,
      error,
      sendResetLink,
    };
  },
};
</script>
