<template>
  <!-- Main Layout with responsive grid -->
  <div class="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-6 h-screen bg-[#ffff]">
    <!-- HAMBURGER BUTTON -->
    <button 
      @click="toggleSidebar" 
      class="hamburger-btn fixed z-20 md:relative ml-4 mt-4 md:ml-0 md:mt-0"
    >
      <span :class="{ open: isSidebarOpen }">&#9776;</span>
    </button>
    
    <!-- SIDEBAR CONTAINER -->
    <div
      :class="[
        'sidebar-container', 
        'transition-all', 
        'duration-300', 
        'ease-in-out',
        'fixed md:relative',
        'z-10',
        'h-screen',
        { 
          'w-[250px]': isSidebarOpen, 
          'w-[80px]': !isSidebarOpen,
          'left-0': isSidebarOpen,
          '-left-full md:left-0': !isSidebarOpen
        }
      ]"
      class="bg-side-bar-2 p-4 flex flex-col"
    >
      <!-- LOADING OVERLAY -->
      <div
        v-if="isLoading"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="loading loading-spinner loading-lg"></div>
        <p class="text-white text-lg mt-4">Task in progress, please wait...</p>
      </div>
      
      <!-- Logo Section -->
      <router-link to="/home" class="flex justify-center md:justify-start">
        <img
          src="../../assets/trailspur-logo.svg"
          alt="Trailspur Logo"
          class="logo mb-8 max-w-[180px]"
          :class="{ 'mx-auto': !isSidebarOpen }"
        />
      </router-link>

      <!-- NAVIGATION MENU -->
      <nav class="nav-menu flex flex-col gap-2">
        <button 
          class="nav-item bg-button text-sm md:text-base truncate" 
          @click="showTable"
          :title="isSidebarOpen ? '' : 'Display Tarrant County Costar Listings'"
        >
          <span v-if="isSidebarOpen">Display Tarrant County Costar Listings</span>
          <span v-else class="flex justify-center">📋</span>
        </button>

        <!-- ACTIONS DROPDOWN -->
        <div class="relative">
          <button 
            class="nav-item bg-side-bar-2 text-sm md:text-base w-full flex items-center justify-between"
            @click="toggleDropdown"
            :title="isSidebarOpen ? '' : 'Actions'"
          >
            <span v-if="isSidebarOpen">Actions</span>
            <span v-else class="flex justify-center">⚙️</span>
            <span
              v-if="isSidebarOpen"
              :class="{
                'rotate-180': isDropdownOpen,
                'rotate-0': !isDropdownOpen,
              }"
              class="ml-2 inline-block transition-transform"
            >
              ▲
            </span>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="isDropdownOpen && isSidebarOpen"
            class="absolute left-0 md:left-full top-0 md:top-auto mt-0 md:mt-2 ml-0 md:ml-2 py-2 w-full md:w-64 shadow-xl z-10 rounded-md bg-white"
          >
            <button
              class="nav-item bg-button block px-4 py-2 text-left font-medium text-sm md:text-base w-full"
              @click="downloadTAD"
            >
              Download TAD Data (GeoDB)
            </button>
            <button
              class="nav-item block px-4 py-2 text-left font-medium text-sm md:text-base w-full"
              @click="spatialMerge"
            >
              Generate Acquisition List
            </button>
            <button
              class="nav-item bg-button block px-4 py-2 text-left font-medium text-sm md:text-base w-full"
              @click="uploadFile"
            >
              Upload Costar File
            </button>
            <button
              class="nav-item bg-button block px-4 py-2 text-left font-medium text-sm md:text-base w-full"
              @click="downloadVacanciesReport"
            >
              Download Costar Vacancies Report
            </button>
          </div>
        </div>
        
        <button 
          class="nav-item bg-button back-button text-sm md:text-base truncate" 
          @click="goback"
          :title="isSidebarOpen ? '' : 'Back'"
        >
          <span v-if="isSidebarOpen">Back</span>
          <span v-else class="flex justify-center">⬅️</span>
        </button>
      </nav>
    </div>

    <!-- MAIN CONTENT AREA -->
    <div
      :class="[
        'main-content',
        'transition-all',
        'duration-300',
        { 
          'ml-0 md:ml-[80px]': !isSidebarOpen,
          'ml-0 md:ml-[250px]': isSidebarOpen 
        }
      ]"
      class="w-full md:w-[calc(100vw-80px)] lg:w-[calc(100vw-250px)] flex flex-col h-screen p-4"
    >
      <div class="flex-grow overflow-auto">
        <div class="overflow-x-auto">
          <table
            v-if="csvData.length"
            class="min-w-full divide-y divide-gray-200 table-auto"
          >
            <thead class="bg-gray-100">
              <tr>
                <th
                  v-for="(header, index) in csvHeaders"
                  :key="index"
                  class="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                >
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(row, rowIndex) in paginatedData"
                :key="rowIndex"
                :class="{ 'bg-gray-50': rowIndex % 2 === 0 }"
              >
                <td
                  v-for="(value, colIndex) in row"
                  :key="colIndex"
                  class="px-4 py-2 whitespace-nowrap text-xs md:text-sm text-gray-700"
                >
                  {{ value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div
          class="flex flex-wrap justify-center items-center gap-2 md:gap-4 mt-4"
          v-if="csvData.length"
        >
          <div class="flex items-center gap-2">
            <span class="text-xs md:text-sm">Rows per page:</span>
            <select 
              v-model="rowsPerPage" 
              class="select select-bordered select-sm w-16 md:w-20 text-xs md:text-sm"
              @change="resetToFirstPage"
            >
              <option v-for="option in rowsPerPageOptions" :value="option" :key="option">
                {{ option }}
              </option>
            </select>
          </div>
          
          <button
            class="btn btn-xs md:btn-sm"
            @click="prevPage"
            :disabled="currentPage === 1"
          >
            Previous
          </button>
          <span class="text-xs md:text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            class="btn btn-xs md:btn-sm"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            Next
          </button>
        </div>

        <!-- Upload & Process & Download Buttons -->
        <div
          class="flex flex-col md:flex-row gap-2 mt-4"
        >
          <div class="join w-full">
            <input
              :key="fileInputKey"
              ref="fileInput"
              type="file"
              class="join-item file-input file-input-bordered w-full text-xs md:text-sm"
              @change="handleFileSelection"
              accept=".xlsx, .xls, .csv"
            />
            <button v-if="selectedFile" class="btn btn-error join-item btn-xs md:btn-sm" @click="clearFile">
              ✕
            </button>
          </div>
          <div class="flex gap-2 w-full">
            <button class="btn btn-xs md:btn-sm flex-grow" @click="uploadFile">
              Upload Costar File
            </button>
            <button class="btn btn-xs md:btn-sm flex-grow" @click="downloadVacanciesReport">
              Download Trailspur Costar Data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Papa from "papaparse";
import { supabase } from "../lib/supabase.js";

export default {
  name: "TableView",
  props: {
    tableName: {
      type: String,
      required: true, // Ensure the parent component always provides a table name
    },
  },
  data() {
    return {
      csvHeaders: [], // Array to store headers
      csvData: [], // Array to store rows of data
      notes: [], // Array to store notes for each row
      currentPage: 1, // Current page for pagination
      rowsPerPage: 10, // Rows displayed per page
      rowsPerPageOptions: [10, 20, 50], // Options for pagination
    };
  },
  computed: {
    paginatedData() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.csvData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.csvData.length / this.rowsPerPage) || 1;
    },
  },
  methods: {
    goBack() {
      // Use window.history.back() to go back to the previous page in history
      window.history.back();
    },
    async fetchCSVFile() {
      try {
        // Fetch data from Supabase using the dynamic tableName prop
        let { data, error } = await supabase
          .from(this.tableName) // Use the prop here
          .select("*");

        if (error) {
          throw error;
        }

        if (!data || data.length === 0) {
          console.warn("No data found in Supabase table.");
          alert("No data available.");
          return;
        }

        // Convert JSON to CSV format
        const csvString = Papa.unparse(data);

        // Parse CSV using PapaParse
        Papa.parse(csvString, {
          header: true, // Extract headers dynamically
          skipEmptyLines: true, // Skip empty rows
          complete: (results) => {
            this.csvHeaders = results.meta.fields; // Extract headers
            this.csvData = results.data; // Extract rows
            this.resetPagination();
          },
        });

      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
        alert("Failed to load data from Supabase.");
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    resetPagination() {
      this.currentPage = 1;
    },
    saveNotes() {
      console.log("Saved Notes:", this.notes);
      alert("Notes saved successfully!");
    },
  },
  mounted() {
    // Automatically fetch the CSV file when the component is mounted
    this.fetchCSVFile();
  },
};
</script>



<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.upload-section {
  margin-bottom: 20px;
}

.table-section {
  margin-top: 20px;
}

textarea {
  width: 100%;
  /* Ensures textarea spans the cell */
  resize: none;
  /* Prevents resizing */

  border-radius: 4px;
  /* Optional: add rounded corners */
  border: 1px solid #ccc;
  height: 100%;
}

textarea {
  width: 100%;
  resize: none;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;


}

/* Hover effect for Previous and Next buttons */
.pagination-controls button:hover {
  cursor: pointer;
  /* Change cursor to pointer when hovered */
  transform: scale(1.1);
}

/* Style for Previous and Next buttons with constant underline */
.pagination-controls button {
  text-decoration: underline;
  /* Underline is always present */
  cursor: default;
  /* Default cursor initially */
  font-weight: bold;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;


}

.save-button {
  padding: 10px 20px;
  background-color: #000000;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.save-button:hover {
  background-color: #000000;
  transform: scale(1.05);
}

/* Add grid lines to the table */
table {
  border-collapse: collapse;
  /* Ensures no space between borders */
  width: 100%;
}

th,
td {
  border: 1px solid black;
  /* Defines grid lines */
  padding: 8px;
  /* Adds some spacing inside cells */
  text-align: left;
  /* Aligns text to the left */
}

/* Optional: Add a border to the table itself */
table {
  border: 2px solid black;
  min-width: 100%;
  /* Ensures the table expands horizontally */
  border-collapse: collapse;
  /* Removes extra spacing */
}

/* Add horizontal scrolling */
.overflow-x-auto {
  overflow-x: auto;
  /* Enables horizontal scrolling */
  white-space: nowrap;
  /* Prevents table content from wrapping */
}

/* Style for table headers */
th {
  background-color: #d3d3d3;
  /* Light grey background */
  color: black;
  /* Text color */
  font-weight: bold;
  /* Make header text bold */
  padding: 10px;
  /* Add spacing */
  text-align: left;
  /* Align text to the left */
  text-transform: uppercase;
}

/* Target the last column of the table */
table td:last-child,
table th:last-child {
  width: 200px;
  /* Adjust the width as per your requirement */
}

.back-button {
  padding: 10px 20px;
  background-color: #000000;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;


}

.back-button:hover {
  background-color: #000000;
  transform: scale(1.05);
}

.save-button,
.back-button {
  width: 10%;
  /* Make both buttons the same width */
}

.fixed-textarea {
  width: 20vw; /* 20% of the viewport width */
  height: 10vh; /* 10% of the viewport height */
  resize: none;
  border-radius: 4px; /* Optional: rounded corners */
  border: 1px solid #ccc; /* Optional: border */
  padding: 8px; /* Optional: padding */
}
</style>
