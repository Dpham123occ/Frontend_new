<template>
    <div class="forgot-password-container">
      <h1 class="forgot-password-title">Forgot Password</h1>
  
      <!-- Email Input -->
      <div class="input-group">
        <label for="email">Email</label>
        <input
          v-model="email"
          type="email"
          id="email"
          placeholder="Enter your email"
          required
          class="input-field"
        />
      </div>
  
      <!-- Send Reset Link Button -->
      <button @click="sendResetLink" class="reset-button">
        Send Reset Link
      </button>
  
      <!-- Success Message -->
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  
      <!-- Error Message -->
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { supabase } from '../lib/supabase';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'ForgotPassword',
    setup() {
      const email = ref(''); // Store the user's email
      const successMessage = ref(''); // Success message
      const error = ref(''); // Error message
      const router = useRouter();
  
      // Send Reset Link Function
      const sendResetLink = async () => {
        try {
          if (!email.value) {
            error.value = 'Please enter your email address.';
            return;
          }
  
          // Send password reset email
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value, {
            redirectTo: 'http://localhost:5173/update-password', // Redirect URL after reset
          });
  
          if (resetError) {
            // Check if the error is due to the email not existing
            if (resetError.message.includes('user not found')) {
              error.value = 'No account found with this email address.';
            } else {
              throw resetError;
            }
          } else {
            // Show success message
            successMessage.value = 'Password reset email sent! Check your inbox.';
            error.value = ''; // Clear any previous error
          }
        } catch (err) {
          console.error('Error sending reset link:', err.message);
          error.value = 'Failed to send reset email. Please try again.';
          successMessage.value = ''; // Clear any previous success message
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
  
  <style scoped>
  .forgot-password-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }
  
  .forgot-password-title {
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
  
  .reset-button {
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
  
  .reset-button:hover {
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