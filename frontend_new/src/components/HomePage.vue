<template>
  <div class="grid grid-cols-8 min-h-screen w-screen fixed inset-0 bg-[#ffff]">
    <!-- Sidebar Component -->
    <Sidebar @sidebarToggle="handleSidebarToggle" />

    <!-- Main Content -->
    <div :class="['main-content', { shifted: isSidebarOpen }]">
      <!-- Wrapper for Left-Aligned Dropdown & Table -->
      <div class="content-wrapper">
        <!-- Dropdown Selector for Category -->
        <div class="category-selector mb-6">
          <label
            for="category"
            class="text-lg font-semibold text-[#231f20] mr-4"
          >
            Select Category:
          </label>
          <select
            v-model="selectedCategory"
            id="category"
            class="p-2 border border-gray-300 rounded-lg shadow-sm"
          >
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Table Section -->
        <div class="table-container">
          <div v-if="selectedCategory" class="table-wrapper">
            <h3 class="text-xl font-semibold text-[#231f20] mb-4 text-center">
              {{ selectedCategory }}
            </h3>
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Costar Tag</th>
                    <th>Last Updated</th>
                    <th>Rental SF/Yr</th>
                    <th>Total Available Space</th>
                    <th>RBA</th>
                    <th>Year Built</th>
                    <th>Property Type</th>
                    <th>Property Address</th>
                    <th>City</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Construction Material</th>
                    <th>Tenancy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in tableData[selectedCategory]"
                    :key="index"
                  >
                    <td>{{ row.id }}</td>
                    <td>{{ row.costar_tag }}</td>
                    <td>{{ row.last_updated }}</td>
                    <td>{{ row.rental_sf_yr }}</td>
                    <td>{{ row.total_available_space }}</td>
                    <td>{{ row.rba }}</td>
                    <td>{{ row.year_built }}</td>
                    <td>{{ row.property_type }}</td>
                    <td>{{ row.property_address }}</td>
                    <td>{{ row.city }}</td>
                    <td>{{ row.latitude }}</td>
                    <td>{{ row.longitude }}</td>
                    <td>{{ row.construction_material }}</td>
                    <td>{{ row.tenancy }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";

export default {
  name: "HomePage",
  components: { Sidebar },
  data() {
    return {
      categories: [
        "Light Industrial Multi Tenant",
        "Industrial User Buildings",
        "IOS Existing",
      ],
      selectedCategory: "Light Industrial Multi Tenant Business Parks",
      isSidebarOpen: true, // Sidebar state

      tableData: {
        "Light Industrial Multi Tenant Business Parks": [
          {
            id: "001",
            costar_tag: "LIMTB-1",
            last_updated: "2025-02-01",
            rental_sf_yr: "$12/SF",
            total_available_space: "10,000 SF",
            rba: "50,000 SF",
            year_built: "1999",
            property_type: "Industrial",
            property_address: "123 Business Park",
            city: "Dallas",
            latitude: "32.7",
            longitude: "-97.1",
            construction_material: "Metal",
            tenancy: "Multi-Tenant",
          },
        ],
        "Industrial User Buildings": [
          {
            id: "002",
            costar_tag: "IUB-1",
            last_updated: "2025-02-01",
            rental_sf_yr: "$15/SF",
            total_available_space: "20,000 SF",
            rba: "75,000 SF",
            year_built: "2005",
            property_type: "Warehouse",
            property_address: "456 User Complex",
            city: "Fort Worth",
            latitude: "32.8",
            longitude: "-97.2",
            construction_material: "Brick",
            tenancy: "Single-Tenant",
          },
        ],
        "IOS Existing": [
          {
            id: "003",
            costar_tag: "IOS-1",
            last_updated: "2025-02-01",
            rental_sf_yr: "$18/SF",
            total_available_space: "30,000 SF",
            rba: "100,000 SF",
            year_built: "2010",
            property_type: "Manufacturing",
            property_address: "789 Industrial Site",
            city: "Arlington",
            latitude: "32.9",
            longitude: "-97.3",
            construction_material: "Concrete",
            tenancy: "Owner-User",
          },
        ],
      },
    };
  },
  methods: {
    handleSidebarToggle(isOpen) {
      this.isSidebarOpen = isOpen;
    },
  },

  mounted() {
    this.isSidebarOpen = true; // ✅ Ensure sidebar is open when the page loads
  },
};
</script>

<style scoped>
/* Main Content */

.main-content {
  flex: 1;
  /* Combine both transitions into one line. */
  transition: margin-left 0.3s ease-in-out, transform 0.3s ease-in-out;
  margin-top: 25px;
  margin-left: -180px; /* Shift left when sidebar is closed */
  padding: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* Default: full size */
  transform: scale(1);
  transform-origin: top left;
}

/* When sidebar is open, shift margin and shrink everything */
.main-content.shifted {
  margin-left: 60px;
  transform: scale(0.8);
}

/* Wrapper for dropdown and table alignment */
.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 1rem; /* Adjust this to move everything left */
  width: 100%;
}

.table-container {
  margin-left: -40px;
}

@media (min-width: 1600px) {
  .table-container {
    /* Larger screens (≥1600px wide) */
    margin-left: -120px;
    transform: scale(0.95);
  }

  .main-content.shifted {
    margin-left: -25px;
    transform: scale(0.9);
  }
}
.main-content.shifted .table-container {
  width: 100vw;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;
  margin-left: -20px; /* Move the table further left */
  background-color: #ffff;
}

/* Table Wrapper */
.table-wrapper {
  width: 100%;
  background: white;
  font-family: "Sentinel – Book Aa", serif;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

/* Table Styling */
.table {
  width: 100%;
  min-width: 1800px;
  border-collapse: collapse;
  table-layout: auto;
}

/* Table Headers and Cells */
th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  white-space: nowrap;
  min-width: 150px;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
  text-align: center;
}

/* Ensure horizontal scrolling if needed */
.overflow-x-auto {
  overflow-x: auto;
  width: 100%;
  max-width: 100vw;
}

.category-selector label,
.category-selector select,
.category-selector select option {
  font-family: "Sentinel – Book Aa", serif;
}

/* Row hover effect */
tr:hover {
  background-color: #f1f1f1;
}
</style>
