<template>
  <!-- Main Layout using Grid -->
  <div class="grid grid-cols-6 h-screen bg-[#ffff]">
    <!-- HAMBURGER BUTTON -->
    <button @click="toggleSidebar" class="hamburger-btn">
      <span :class="{ open: isSidebarOpen }">&#9776;</span>
    </button>
    <!-- SIDEBAR CONTAINER -->
    <div :class="['sidebar-container', { open: isSidebarOpen }]"
      class="w-[250px] col-span-1 bg-side-bar-2 p-4 flex flex-col">
      <!-- LOADING OVERLAY -->
      <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="loading loading-spinner loading-lg"></div>
        <p class="text-white text-lg mt-4">Task in progress, please wait...</p>
      </div>
      <!-- Logo Section -->
      <router-link to="/home">
        <img
          src="../../assets/trailspur-logo.svg"
          alt="Trailspur Logo"
          class="logo mb-8"
        />
      </router-link>

      <!-- NAVIGATION MENU -->
      <nav class="nav-menu flex flex-col gap-2">
        <button class="nav-item bg-button" @click="showTable">
          Display Tarrant County Vacancy Report
          
        </button>

        <!-- ACTIONS DROPDOWN -->
        <div class="relative">
          <button class="nav-item bg-side-bar-2" @click="toggleDropdown">
            Actions
            <span :class="{'rotate-180': isDropdownOpen, 'rotate-0': !isDropdownOpen}" class="ml-2 inline-block transition-transform">
              ▲ <!-- This is a simple down arrow -->
            </span>
          </button>
          
          <!-- Dropdown Menu to the right of the button -->
          <div
            v-if="isDropdownOpen"
            class="absolute left-full top-0 ml-5 py-2 w-64 shadow-xl z-10 rounded-md"
          >
            <button
              class="nav-item bg-button block px-4 py-2 text-left font-medium text-xl"
              @click="downloadTAD"
            >
              Import TAD's Appraisal Data - Take time
            </button>
            <button class="nav-item block px-4 py-2 text-left font-medium text-xl" @click="spatialMerge">
              Perform Spatial Merge - Take time
            </button>
            <button
              class=" nav-item bg-button block px-4 py-2 text-left font-medium text-xl"
              @click="uploadFile"
            >
              Process TAD Data
            </button>
            <button class="nav-item bg-button block px-4 py-2 text-left font-medium text-xl" @click="downloadVacanciesReport">
              Download Vacancies Report
            </button>
          </div>
        </div>
        <button class="nav-item bg-button back-button" @click="goback">
          Back
        </button>
      </nav>
    </div>

    <!-- TABLE & BUTTONS SECTION -->
    <!-- Occupies the rest of the screen using col-start-2 col-span-5. -->
    <!-- Wrap in main-content + conditionally add 'shifted' to move it right when sidebar is open -->
    <div
      :class="['main-content', { shifted: isSidebarOpen }]"
      class="col-start-2 col-span-5 flex flex-col h-screen p-4"
    >
      <div class="flex-grow overflow-auto">
        <table
          v-if="filteredData.length"
          class="overflow-x-auto table table-md"
        >
          <thead class="bg-gray-100">
            <tr>
              <th
                v-for="(header, index) in csvHeaders"
                :key="index"
                class="cursor-pointer"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in paginatedSortedData" :key="rowIndex"
              :class="{ 'bg-gray-100': rowIndex % 2 === 0 }">
              <td v-for="(value, colIndex) in row" :key="colIndex" v-html="highlightMatch(value)"></td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination Controls -->
        <div
          class="col-start-2 col-end-5 rows-start-4 rows-end-4 col-span-4 flex justify-center items-center gap-4"
          v-if="csvData.length"
        >
          <button
            class="btn btn-s"
            @click="prevPage"
            :disabled="currentPage === 1"
          >
            Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="btn btn-s" @click="nextPage" :disabled="currentPage === totalPages">
            Next
          </button>
        </div>

        <!-- Upload & Process & Download Buttons -->
        <div
          class="col-start-2 col-end-5 rows-start-5 rows-end-5 col-span-4 join"
        >
          <!-- <label for="districtSelect">Select District:</label>
                  <select v-model="uploadRegion" id="districtSelect">
                      <option disabled value="">Select a district</option>
                      <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
                  </select> -->
          <input
            type="file"
            class="join-item file-input file-input-bordered"
            @change="handleFileSelection"
            accept=".xlsx, .xls, .csv"
          />
          <button class="btn btn-s join-item" @click="uploadFile">
            Process Costar Vacancies Report
          </button>
          <button class="btn btn-s join-item" @click="downloadVacanciesReport">
            Download Vacancies Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* IMPORTS */
import router from "../../router/router";
import axios from "axios";
import papaparse from "papaparse";
import { supabase } from "../../lib/supabase";

export default {
  name: "Tarrant",
  data() {
    return {
      /* TABLE HEADERS, DATA, PAGINATION */
      csvHeaders: [], // Array to store table headers
      csvData: [], // Array to store all rows of data
      currentPage: 1, // Current page for pagination
      rowsPerPage: 15, // Number of rows displayed per page

      /* FILE UPLOAD */
      selectedFile: null, // Currently selected file for upload

      /* SEARCH & SORT */
      searchQuery: "", // Search query for filtering table
      sortKey: "", // Column to sort by
      sortOrder: "asc", // Sorting order (ascending/descending)

      /* UI STATES */
      isLoading: false,
      isDropdownOpen: false, // State to control the dropdown visibility
      isSidebarOpen: true, // Start the sidebar open
    };
  },
  computed: {
    /* TOTAL PAGES for pagination */
    totalPages() {
      return Math.ceil(this.filteredData.length / this.rowsPerPage) || 1;
    },

    /* SORT THE DATA */
    sortedData() {
      // If no sort key is chosen, return the filtered data as-is
      if (!this.sortKey) return this.filteredData;

      return [...this.filteredData].sort((a, b) => {
        const valueA = a[this.csvHeaders.indexOf(this.sortKey)];
        const valueB = b[this.csvHeaders.indexOf(this.sortKey)];

        // Convert certain fields to numbers for correct sorting
        const numericFields = [
          "id",
          "Longitude",
          "Latitude",
          "Year_Built",
          "Total_Available_Space",
          "Rent_SF_Yr",
          "last_updated",
        ];
        const isNumeric = numericFields.includes(this.sortKey);

        let comparison = isNumeric
          ? Number(valueA) - Number(valueB)
          : String(valueA).localeCompare(String(valueB));

        return this.sortOrder === "asc" ? comparison : -comparison;
      });
    },

    /* PAGINATED + SORTED DATA */
    paginatedSortedData() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.sortedData.slice(start, end);
    },

    /* FILTERED DATA (by search) */
    filteredData() {
      // If no search query, return the entire csvData
      if (!this.searchQuery) return this.csvData;

      // Otherwise, filter rows
      return this.csvData.filter((row) =>
        row.some((value) =>
          value
            .toString()
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        )
      );
    },
  },
  methods: {
    /* ----------- SIDEBAR TOGGLE ---------- */
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },

    /* ----------- DROPDOWN TOGGLE ---------- */
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },

    /* ----------- TABLE SORTING ---------- */
    sortTable(column) {
      if (this.sortKey === column) {
        // If user clicks the same column, toggle sort order
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        // Otherwise, set the sort key to the new column, default to ascending
        this.sortKey = column;
        this.sortOrder = "asc";
      }
    },

    /* ----------- SEARCH HIGHLIGHTING ---------- */
    highlightMatch(value) {
      if (!this.searchQuery || typeof value !== "string") return value;
      const regex = new RegExp(`(${this.searchQuery})`, "gi");
      return value
        .toString()
        .replace(regex, `<span class="highlight">$1</span>`);
    },

    /* ----------- API CALL: SPATIAL MERGE ---------- */
    async spatialMerge() {
      this.isLoading = true;
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/spatial-join`,
          {}
        );
        alert("API called successfully: " + response.data.statusCode);
      } catch (error) {
        console.error("Error calling API:", error);
        alert("Failed to call API");
      } finally {
        this.isLoading = false;
      }
    },

    async downloadTAD() {
      this.isLoading = true;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/download-tad`);
        alert("API called successfully: " + response.data.statusCode);
      } catch (error) {
        console.error("Error calling API:", error);
        alert("Failed to call API");
      } finally {
        this.isLoading = false;
      }
    },

    /* ----------- SHOW TABLE (FROM SUPABASE) ---------- */
    async showTable() {
      this.isLoading = true;
      try {
        let { data: master_vacancy_list, error } = await supabase
          .from("master_vacancy_list")
          .select("*");

        if (error) {
          throw error;
        }

        if (!master_vacancy_list || master_vacancy_list.length === 0) {
          console.warn("No data found in Supabase table.");
          alert("No data available.");
          return;
        }

        // Convert JSON to CSV format
        const csvString = papaparse.unparse(master_vacancy_list);

        // Parse CSV using PapaParse to extract headers & data
        papaparse.parse(csvString, {
          header: true, // Extract headers automatically
          skipEmptyLines: true,
          complete: (results) => {
            this.csvHeaders = results.meta.fields;
            this.csvData = results.data;
          },
        });
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
        alert("Failed to load data from Supabase.");
      } finally {
        this.isLoading = false;
      }
    },

    /* ----------- NAVIGATE BACK ---------- */
    goback() {
      router.push("/home");
    },

    /* ----------- FILE HANDLING ---------- */
    handleFileSelection(event) {
      this.selectedFile = event.target.files[0];
    },

    /* ----------- API CALL: UPLOAD FILE ---------- */
    async uploadFile() {
      if (this.selectedFile) {
        const file = this.selectedFile;
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await axios.post(
            "http://127.0.0.1:8000/upload-costar-file/",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          console.log("File uploaded successfully:", response.data);
          alert(response.data.message || "File uploaded successfully!");
        } catch (error) {
          console.error("Error uploading file:", error);
          alert(
            "An error occurred while uploading the file: " +
              (error.response?.data?.message || error.message)
          ); // Display user-friendly error message, including server error if available.
        }
      } else {
        alert("Please select a file.");
      }
    },

    /* ----------- PAGINATION CONTROLS ---------- */
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },

    /* ----------- API CALL: DOWNLOAD VACANCIES REPORT ---------- */
    async downloadVacanciesReport() {
      this.isLoading = true;
      try {
        // Fetch data from Supabase
        let { data, error } = await supabase
          .from("master_vacancy_list") // Use correct table name as a string
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
        const csvString = papaparse.unparse(data);

        // Extract headers and data (if needed for UI updates)
        this.csvHeaders = Object.keys(data[0] || {}); // Extract column headers
        this.csvData = data; // Store data for UI

        // Create CSV file and trigger download
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "master_vacancy_table.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Call processVacanciesReport() if needed
        // await this.processVacanciesReport(); 
      } catch (error) {
        console.error("Error downloading CSV:", error);
        alert("Failed to download CSV.");
      } finally {
        this.isLoading = false; // Ensure isLoading is updated
      }
    }
  },
};
</script>

<style scoped>
/* ----------------------------------------------------------------------------
   SIDEBAR & HAMBURGER STYLES
   ---------------------------------------------------------------------------- */

/* The sidebar container is fixed to the left, hidden by default (-250px). */
.sidebar-container {
  background-color: #d1dde6;
  height: 100vh;
  position: fixed;
  top: 0;
  left: -250px; /* Hidden by default. */
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e6e6e6;
  z-index: 999;
  transition: left 0.3s ease-in-out; /* Smooth slide in/out */
}

/* When isSidebarOpen = true, we add the "open" class to slide the sidebar in. */
.sidebar-container.open {
  left: 0;
}

/* Hamburger button is fixed so it stays in the top-left corner. */
.hamburger-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  z-index: 1000;
  color: #967444;
}

/* Rotate the hamburger icon 90deg when sidebar is open. */
.hamburger-btn span {
  transition: transform 0.3s ease-in-out;
}
.hamburger-btn span.open {
  transform: rotate(90deg);
}

/* ----------------------------------------------------------------------------
   NAV MENU STYLES
   ---------------------------------------------------------------------------- */
.nav-menu {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Shared nav-item styles */
.nav-item {
  display: block;
  width: 100%;
  border: none;
  color: #ffff;
  text-align: left;
  font-weight: 500;
  font-size: 20px;
  font-family: "Sentinel – Book Aa", serif;
  cursor: pointer;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  background-color: #231f20; /* same as parent by default */
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

/* Hover effect */
.nav-item:hover,
.nav-item:focus {
  background-color: #d6d2c4; /* Light hover color */
  color: #2c3e50; /* Text color stays dark */
  transform: scale(1.05); /* Adds the zoom effect */
}

/* Special back-button style */
.back-button {
  background-color: #231f20;
  color: #ffffff;
  margin-top: 1rem;
  text-align: center;
  transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth hover transition */
}
.back-button:hover {
  background-color: #1a252f;
  transform: scale(1.05); /* Zoom effect for back button */
}

/* ----------------------------------------------------------------------------
   HIGHLIGHT STYLES FOR SEARCH MATCHES
   ---------------------------------------------------------------------------- */
.highlight {
  background-color: yellow;
  font-weight: bold;
}

/* ----------------------------------------------------------------------------
   SHIFT MAIN CONTENT WHEN SIDEBAR IS OPEN
   ---------------------------------------------------------------------------- */
.main-content {
  transition: transform 0.3s ease-in-out;
}
.main-content.shifted {
  transform: translateX(100px); /* Shift by the sidebar width */
}
</style>
