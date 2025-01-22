<template>
  <div class="main-container">
    <!-- Sidebar Component -->
    <Sidebar />

    <!-- Acquisition List Component -->
    <div class="acquisition-list-container">
      <h2 class="title">Acquisition List</h2>
      <div class="button-list">
        <!-- Property Button List -->
        <button
          v-for="property in properties"
          :key="property.name"
          class="property-button"
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
.main-container {
  display: flex;
  height: 100vh;
}

.acquisition-list-container {
  padding: 2rem;
  background-color: #f5f5f5;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 1.5rem;
  color: #967444;
  font-family: 'Inglesia Caps Variable', serif;
  margin-bottom: 1rem;
}

.button-list {
  display: grid;
  gap: 1rem;
  width: 100%;
  grid-template-columns: 1fr;
}

.property-button {
  padding: 1.5rem;
  background-color: #d8d2c4;
  color: #231f20;
  border: none;
  border-radius: 5px;
  font-family: 'Brother 1816 Reg', sans-serif;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

.property-button:hover {
  background-color: #967444;
  color: white;
}
</style>
