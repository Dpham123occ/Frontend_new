<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
const {isAuthenticated} = useAuth0()
import LoginButton from './button/LoginButton.vue';
</script>

<template>
  <div v-if="!isAuthenticated">
    <LoginButton></LoginButton>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
