<template>
  <div>
    <Sidebar />
    <div
      class="col-start-2 col-span-6 flex flex-col h-screen p-8 bg-[#f9f9f9] rounded-lg shadow-inner flex-grow mx-auto justify-start items-center mt-8"
    >
      <h2 class="title text-3xl font-bold text-center text-[#967444] mb-6">
        Appraisal District 
      </h2>
      <div
        class="button-list flex flex-col gap-4 items-center w-full max-w-2xl"
      >
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
        { name: "Harris County", 
          route: "/appraisaldistrict/harris" },
        {
          name: "Collin County",
          route: "/appraisaldistrict/tarrant",
        },
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
/* Match the look of the first sidebar */

.sidebar-container {
  background-color: #d1dde6;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  box-sizing: border-box;

  /* Subtle shadow + border for a modern look */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e6e6e6;
  z-index: 999;

  /* Same width as the other sidebar (250px).
     Because we use grid, we set col-span-1 for 6 columns.
     Ensure your overall container is wide enough that col-span-1 ~ 250px. */
  min-width: 250px;

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
}

.logo-section {
  margin-bottom: 2rem;
  text-align: center;
}

.logo {
  width: 200px;
  height: auto;
  object-fit: contain;
}

/* Navigation Menu */
.nav-menu {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Navigation Menu */
.nav-menu {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Shared nav-item styles */
.nav-item {
  display: block;
  width: 100%;
  background-color: transparent;
  border: none;
  color: #231f20;
  text-align: left;
  font-weight: 500;
  font-size: 20px;
  cursor: pointer;

  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;

  /* Adding transition for smooth hover effect */
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

/* Hover/active state with zoom effect */
.nav-item:hover,
.nav-item:focus {
  background-color: #d6d2c4; /* Light hover color */
  color: #2c3e50; /* Text color stays dark */
  transform: scale(1.05); /* Adds the zoom effect */
}

/* Special back-button style */
.back-button {
  background-color: #2c3e50;
  color: #ffffff;
  margin-top: 1rem;
  text-align: center;
  transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth hover transition */
}

.back-button:hover {
  background-color: #1a252f;
  transform: scale(1.05); /* Zoom effect for back button */
}

.highlight {
  background-color: yellow;
  font-weight: bold;
}
</style>
