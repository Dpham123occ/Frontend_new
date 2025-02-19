<template>
  <div class="grid grid-cols-8 h-screen bg-[#fff]">
    <!-- Sidebar Component -->
    <Sidebar @sidebarToggle="handleSidebarToggle" />

    <!-- Appraisal District Section -->
    <div
      :class="[
        'col-start-2 col-span-6 flex flex-col h-screen p-8 bg-[#fff] rounded-lg shadow-inner flex-grow mx-auto justify-start items-center mt-8',
        { shifted: isSidebarOpen },
      ]"
    >
      <h2 class="title text-3xl font-bold text-center text-[#231f20] mb-6">
        Appraisal District
      </h2>

      <div
        class="button-list flex flex-col gap-4 items-center w-full max-w-2xl"
      >
        <button
          v-for="property in properties"
          :key="property.name"
          class="property-button w-full p-4 bg-[#fff] text-[#ffff] rounded-lg font-semibold shadow-md hover:bg-[#967444] hover:text-white transition-transform transform hover:scale-105 border border-gray-300"
          @click="selectProperty(property)"
        >
          {{ property.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";

export default {
  name: "AppraisalDistrict",
  components: {
    Sidebar,
  },
  data() {
    return {
      properties: [
        {
          name: "Tarrant County",
          route: "/appraisaldistrict/tarrant",
        },
        {
          name: "Dallas County",
          route: "/appraisaldistrict/dallas",
        },
        {
          name: "Harris County",
          route: "/appraisaldistrict/harris",
        },
        {
          name: "Collin County",
          route: "/appraisaldistrict/collin",
        },
      ],
      isSidebarOpen: true,
    };
  },
  methods: {
    selectProperty(property) {
      this.$router.push(property.route);
    },
    handleSidebarToggle(isOpen) {
      this.isSidebarOpen = isOpen;
    },
  },
};
</script>

<style scoped>
/* Appraisal District Section */
.col-start-2 {
  flex: 1;
  transition: transform 0.3s ease-in-out;
  transform: translateX(0px);
  font-family: "Sentinel – Book Aa", serif;
}

/* Shift back when sidebar is closed */
.shifted {
  transform: translateX(120px);
}

/* Button List - Expand Width */
.button-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%;
  width: 500px;
}

/* Property Buttons */
.property-button {
  width: 100%;
  width: 500px;
  padding: 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.2rem;
  font-family: "Sentinel – Book Aa", serif;
  cursor: pointer;
  text-align: center;
  background-color: #231f20;
  color: #ffff;
  border: 1px solid #d8d2c4;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.property-button:hover {
  background-color: #967444;
  color: white;
  transform: scale(1.05);
  border: none;
}
</style>
