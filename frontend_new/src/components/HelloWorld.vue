<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
const {isAuthenticated} = useAuth0()
import LoginButton from './button/LoginButton.vue';
import LogOutButton from './button/LogOutButton.vue';
</script>

<template>
  <div v-if="!isAuthenticated">
    <LoginButton></LoginButton>
  </div>
  <div v-else>
    <p>Im in</p>
    <LogOutButton></LogOutButton>
  </div>
</template>

<style scoped>

</style>
