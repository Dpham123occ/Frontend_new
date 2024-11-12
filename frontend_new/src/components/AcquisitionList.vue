<template>
  <div class="main-container">
    <!-- Sidebar Component -->
    <div class="sidebar">
      <!-- Logo Section -->
      <div class="logo-section">
        <img src="../assets/TSBlack.png" alt="Trailspur Logo" class="logo" />
      </div>

      <nav class="nav-menu">
        <button class="nav-item" @click="navigateTo('home')">Home</button>
        <button class="nav-item" @click="navigateTo('import')">Import Button</button>
        <button class="nav-item" @click="navigateTo('generate')">Generate Report</button>
        <button class="nav-item" @click="navigateTo('view')">View Reports</button>
        <button class="nav-item" @click="navigateTo('settings')">Settings</button>
        <button class="nav-item back-button" @click="goBack">Back</button>
      </nav>
    </div>

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
export default {
  name: 'AcquisitionList',
  data() {
    return {
      properties: [
        { name: 'Light Industrial -Multi Tenant', route: '/acquisition-list/light-industrial-MT' },
        { name: 'Light Industrial -User Buildings', route: '/acquisition-list/light-industrial-UB' },
        { name: 'IOS -Existing', route: '/acquisition-list/IOSExsiting' },
        { name: 'IOS Developable Land', route: '/acquisition-list/IOSDevelopment' },
      ],
    };
  },
  methods: {
    selectProperty(property) {
      this.$router.push(property.route);
    },
    navigateTo(page) {
      console.log(`Navigating to ${page}`);
    },
    goBack() {
      this.$router.go(-1); // Navigate back to the previous page
    },
  },
};
</script>

<style scoped>
/* Main container styling */
.main-container {
  display: flex;
  height: 100vh;
}

/* Sidebar styling */
.sidebar {
  width: 220px;
  background-color: #d1dede; /* texas-sky */
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

/* Logo Section */
.logo-section {
  margin-bottom: 2rem;
}

.logo {
  width: 180px;
  height: auto;
  object-fit: contain;
}

/* Navigation menu styling */
.nav-menu {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.nav-item {
  padding: 1rem;
  background-color: transparent;
  border: none;
  color: #231F20; /* black-iron */
  text-align: left;
  font-weight: bold;
  font-family: 'Brother 1816 Reg', sans-serif; /* secondary font */
  cursor: pointer;
  width: 100%;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: #d8d2c4; /* trail-dust */
}

/* Back Button styling */
.back-button {
  margin-top: 1rem;
  background-color: #231F20; /* black-iron */
  color: white;
}

.back-button:hover {
  background-color: #967444; /* bronze-leather */
}

/* Acquisition List container styling */
.acquisition-list-container {
  padding: 2rem;
  background-color: #f5f5f5;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Title styling */
.title {
  font-size: 1.5rem;
  color: #967444; /* bronze-leather */
  font-family: 'Inglesia Caps Variable', serif; /* primary-brand font */
  margin-bottom: 1rem;
}

/* Button list container */
.button-list {
  display: grid;
  gap: 1rem;
  width: 100%;
  grid-template-columns: 1fr; /* Single column layout */
}

/* Property button styling */
.property-button {
  padding: 1.5rem;
  background-color: #d8d2c4; /* trail-dust */
  color: #231F20; /* black-iron */
  border: none;
  border-radius: 5px;
  font-family: 'Brother 1816 Reg', sans-serif; /* secondary font */
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

.property-button:hover {
  background-color: #967444; /* bronze-leather */
  color: white;
}
</style>
