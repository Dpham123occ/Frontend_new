<template>
    <div class="home">
      <Sidebar></Sidebar>
    </div>
  </template>
  
  <script>
  import Sidebar from './Sidebar.vue';
  export default {
    name: 'HomePage',
    components: {
      Sidebar
    },
  };
  </script>
  
  <style scoped>
  /* Add styles here if needed */
  </style>