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
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#967444]" 
          @input="validatePassword" />
      </div>

      <!-- Password Requirements -->
      <div class="mb-4 text-left text-sm text-gray-600">
        <p class="font-medium mb-1">Password must:</p>
        <ul class="list-disc pl-5 space-y-1">
          <li :class="{'text-green-500': meetsLength, 'text-red-500': !meetsLength && newPassword.length > 0}">
            Be 8-127 characters long
          </li>
          <li :class="{'text-green-500': hasLetter, 'text-red-500': !hasLetter && newPassword.length > 0}">
            Contain at least one letter (A-Z)
          </li>
          <li :class="{'text-green-500': hasNumber, 'text-red-500': !hasNumber && newPassword.length > 0}">
            Contain at least one number (0-9)
          </li>
          <li :class="{'text-green-500': hasSpecialChar, 'text-red-500': !hasSpecialChar && newPassword.length > 0}">
            Contain at least one special character (!@#$%^&* etc.)
          </li>
        </ul>
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
      <button @click="updatePassword" :disabled="!isPasswordValid"
        class="w-full bg-[#967444] text-white py-2 px-4 rounded-md hover:bg-[#7a5c36] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
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
import { ref, onMounted, computed } from "vue";
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

    // Password validation flags
    const meetsLength = ref(false);
    const hasLetter = ref(false);
    const hasNumber = ref(false);
    const hasSpecialChar = ref(false);

    // Special characters allowed
    const specialChars = "!#$^&*(){}[]-_=+`~;'\"?/,<>.";

    // Validate password against policy
    const validatePassword = () => {
      const pass = newPassword.value;
      
      meetsLength.value = pass.length >= 8 && pass.length <= 127;
      hasLetter.value = /[A-Za-z]/.test(pass);
      hasNumber.value = /[0-9]/.test(pass);
      hasSpecialChar.value = new RegExp(`[${specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(pass);
    };

    // Computed property to check if password meets all requirements
    const isPasswordValid = computed(() => {
      return meetsLength.value && 
             hasLetter.value && 
             hasNumber.value && 
             hasSpecialChar.value &&
             newPassword.value === confirmPassword.value;
    });

    // Listen for the PASSWORD_RECOVERY event
    onMounted(() => {
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          console.log("PASSWORD_RECOVERY event detected");
        }
      });
    });

    // Update Password Function
    const updatePassword = async () => {
      try {
        error.value = "";

        if (!isPasswordValid.value) {
          error.value = "Please ensure your password meets all requirements.";
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
        error.value = "";

        // Redirect to home page after a short delay
        if (router.currentRoute.value.path === "/update-password") {
          setTimeout(() => {
            supabase.auth.signOut();
            router.push("/");
          }, 2000);
        }

      } catch (err) {
        console.error("Error updating password:", err.message);
        error.value = "Failed to update password. Please try again.";
        successMessage.value = "";
      }
    };

    return {
      newPassword,
      confirmPassword,
      successMessage,
      error,
      meetsLength,
      hasLetter,
      hasNumber,
      hasSpecialChar,
      isPasswordValid,
      validatePassword,
      updatePassword,
    };
  },
};
</script>