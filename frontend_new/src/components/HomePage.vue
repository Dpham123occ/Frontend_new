<template>
  <div class="grid grid-cols-8 h-screen bg-gray-50 overflow-auto">
    <!-- Sidebar Component -->
    <Sidebar @sidebarToggle="handleSidebarToggle" />

    <!-- Main Content -->
    <div 
      :class="['main-content', { 'shifted': isSidebarOpen }]"
    >
      <!-- Dropdown Selector for Category -->
      <div class="mb-6">
        <label for="category" class="text-lg font-semibold text-[#2c3e50] mr-4">Select Category:</label>
        <select v-model="selectedCategory" id="category" class="p-2 border border-gray-300 rounded-lg shadow-sm">
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </div>

      <!-- Table Section -->
      <div class="table-container">
        <div v-if="selectedCategory" class="table-wrapper ml-60">
          <h3 class="text-xl font-semibold text-[#2c3e50] mb-4 text-center">{{ selectedCategory }}</h3>
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
                <tr v-for="(row, index) in tableData[selectedCategory]" :key="index">
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
</template>

<script>
import Sidebar from './Sidebar.vue';

export default {
  name: 'HomePage',
  components: { Sidebar },
  data() {
    return {
      categories: ['Light Industrial Multi Tenant', 'Industrial User Buildings', 'IOS Existing'],
      selectedCategory: 'Light Industrial Multi Tenant Business Parks',
      isSidebarOpen: true, // Sidebar state

      tableData: {
        'Light Industrial Multi Tenant Business Parks': [
          { 
            id: '001',
            costar_tag: 'LIMTB-1',
            last_updated: '2025-02-01',
            rental_sf_yr: '$12/SF',
            total_available_space: '10,000 SF',
            rba: '50,000 SF',
            year_built: '1999',
            property_type: 'Industrial',
            property_address: '123 Business Park',
            city: 'Dallas',
            latitude: '32.7',
            longitude: '-97.1',
            construction_material: 'Metal',
            tenancy: 'Multi-Tenant'
          },
        ],
        'Industrial User Buildings': [
          { 
            id: '002',
            costar_tag: 'IUB-1',
            last_updated: '2025-02-01',
            rental_sf_yr: '$15/SF',
            total_available_space: '20,000 SF',
            rba: '75,000 SF',
            year_built: '2005',
            property_type: 'Warehouse',
            property_address: '456 User Complex',
            city: 'Fort Worth',
            latitude: '32.8',
            longitude: '-97.2',
            construction_material: 'Brick',
            tenancy: 'Single-Tenant'
          },
        ],
        'IOS Existing': [
          { 
            id: '003',
            costar_tag: 'IOS-1',
            last_updated: '2025-02-01',
            rental_sf_yr: '$18/SF',
            total_available_space: '30,000 SF',
            rba: '100,000 SF',
            year_built: '2010',
            property_type: 'Manufacturing',
            property_address: '789 Industrial Site',
            city: 'Arlington',
            latitude: '32.9',
            longitude: '-97.3',
            construction_material: 'Concrete',
            tenancy: 'Owner-User'
          },
        ]
      }
    };
  },
  methods: {
    handleSidebarToggle(isOpen) {
      this.isSidebarOpen = isOpen;
    }
  },
  
   mounted() {
    this.isSidebarOpen = true; // ✅ Ensure sidebar is open when the page loads
  }
};
</script>

<style scoped>
/* Main Content */
.main-content {
  flex: 1;
  transition: margin-left 0.3s ease-in-out;
  margin-left: 0px;
  padding: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Shifted when sidebar is open */
.main-content.shifted {
  margin-left: 250px; /* Same as sidebar width */
}

/* Table Container */
.table-container {
  width: 100vw; /* Full viewport width */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin-left:750px;
}

/* Table Wrapper */
.table-wrapper {
  width: 100%;
  max-width: 100vw; /* Full screen width */
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  overflow-x: auto; /* Enable horizontal scrolling */
}

/* Table Styling */
.table {
  width: 100%;
  min-width: 1800px; /* Prevents table from being too narrow */
  border-collapse: collapse;
  table-layout: auto; /* Dynamic column width */
}

/* Table Headers and Cells */
th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  white-space: nowrap; /* Prevents text wrapping */
  min-width: 150px; /* Ensure columns don't shrink too much */
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

/* Row hover effect */
tr:hover {
  background-color: #f1f1f1;
}
</style>
