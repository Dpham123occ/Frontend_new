<template>
  <div class="grid grid-cols-8 h-screen bg-gray-50">
    <!-- Sidebar Component -->
    <Sidebar />

    <!-- Acquisition List Section -->
    <div class="col-start-2 col-span-6 flex flex-col h-screen p-8 bg-[#f9f9f9] rounded-lg shadow-inner flex-grow mx-auto justify-start items-center mt-8">
      <h2 class="title text-3xl font-bold text-center text-[#967444] mb-6">Acquisition List</h2>
      <div class="button-list flex flex-col gap-4 items-center w-full max-w-2xl">
        <button
          v-for="property in properties"
          :key="property.name"
          class="property-button w-full p-4 bg-[#ffffff] text-[#2c3e50] rounded-lg font-semibold shadow-md hover:bg-[#967444] hover:text-white transition-transform transform hover:scale-105 border border-gray-300"
          @click="selectProperty(property)"
        >
          {{ property.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue';

export default {
  name: 'AcquisitionList',
  components: {
    Sidebar,
  },
  data() {
    return {
      properties: [
        { name: 'Light Industrial - Multi Tenant', route: '/acquisition-list/LightIndustrialMT' },
        { name: 'Light Industrial - User Buildings', route: '/acquisition-list/LightIndustrialUB' },
        { name: 'IOS - Existing', route: '/acquisition-list/IOSExisting' },
        { name: 'IOS - Developable Land', route: '/acquisition-list/IOSDevelopment' },
      ],
    };
  },
  methods: {
    selectProperty(property) {
      this.$router.push(property.route);
    },
  },
};
</script>

<style scoped>
.sidebar-container {
  background-color: #ffffff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  box-sizing: border-box;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e6e6e6;
  z-index: 999;
  min-width: 250px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.logo {
  width: 200px;
  height: auto;
  object-fit: contain;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.nav-item {
  display: block;
  width: 100%;
  background-color: transparent;
  border: none;
  color: #2c3e50;
  text-align: left;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-item:hover {
  background-color: #f2f2f2;
}

.back-button {
  background-color: #2c3e50;
  color: #ffffff;
  text-align: center;
  border-radius: 8px;
  padding: 1rem;
}

.back-button:hover {
  background-color: #1a252f;
}

.button-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%;
  max-width: 600px;
}

.property-button {
  background-color: #ffffff;
  color: #2c3e50;
  padding: 1.5rem;
  border: 1px solid #d8d2c4;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
  width: 100%;
  text-align: center;
}

.property-button:hover {
  background-color: #967444;
  color: white;
  transform: scale(1.05);
  border: none;
}

.title {
  font-family: "Inglesia Caps Variable", serif;
  color: #967444;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}
</style>