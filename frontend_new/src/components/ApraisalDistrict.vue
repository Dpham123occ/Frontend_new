<template>
  <div class="grid grid-cols-6 h-screen">
    <!-- Sidebar Container -->
    <div class="sidebar-container w-[250px] col-span-1 bg-gray-200 p-4 flex flex-col">
      <!-- Logo Section -->
      <router-link to="/home">
        <img src="../assets/TSBlack.png" alt="Trailspur Logo" class="logo" />
      </router-link>
      <!-- Nav Items -->
      <nav class="nav-menu flex flex-col gap-2">
        <button class="nav-item bg-button" @click="showTable">
          Display Tarrant's Vacancies
        </button>
        <button class="nav-item bg-button" @click="downloadTAD">
          Download TAD Parcel
        </button>
        <button class="nav-item bg-button" @click="spatialMerge">
          Perform Spatial Merge
        </button>
        <button class="nav-item bg-button back-button" @click="goback">
          Back
        </button>
      </nav>
    </div>

    <!-- Table and Buttons Section -->
    <div class="col-start-2 col-span-5 flex flex-col h-screen p-4">
      <div class="flex-grow overflow-auto">
        <div class="mb-4 flex items-center gap-2">
          <input type="text" v-model="searchQuery" placeholder="Search table..." class="border p-2 rounded-md w-1/3" />
      <button class="btn btn-s" @click="clearSearch">Clear</button>
        </div>
        <table v-if="filteredData.length" class="overflow-x-auto table table-md">
          <thead class="bg-gray-100">
            <tr>
              <th v-for="(header, index) in csvHeaders" :key="index" @click="sortTable(header)" class="cursor-pointer">
                {{ header }}
                <span v-if="sortKey === header">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}

                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in paginatedSortedData" :key="rowIndex"
              :class="{ 'bg-gray-100': rowIndex % 2 === 0 }">
              <td v-for="(value, colIndex) in row" :key="colIndex" v-html="highlightMatch(value)">

              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination Controls -->
        <div class="col-start-2 col-end-5 rows-start-4 rows-end-4 col-span-4 flex justify-center items-center gap-4" 
        v-if="csvData.length">
          <button class="btn btn-s"@click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="btn btn-s" @click="nextPage" :disabled="currentPage === totalPages">Next</button>

        </div>

        <!-- Upload & Process& Download Buttons -->
        <div class="col-start-2 col-end-5 rows-start-5 rows-end-5 col-span-4 join">
          <!-- <label for="districtSelect">Select District:</label>
                <select v-model="uploadRegion" id="districtSelect">
                    <option disabled value="">Select a district</option>
                    <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
                </select> -->
          <input type="file" class="join-item file-input file-input-bordered" @change="handleFileSelection"
            accept=".xlsx, .xls, .csv" /> 
          <button class="btn btn-s join-item" @click="uploadFile">Upload Costar Vacancies Report</button>
          <button class="btn btn-s join-item" @click="processVacanciesReport">Process Vacancies Report</button>
          <button class="btn btn-s join-item" @click="downloadVacanciesReport">Download Vacancies Report</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router/router";
import axios from "axios";

export default {
  name: "AppraisalDistrict",
  data() {
    return {
      csvHeaders: [], // Array to store table headers
      csvData: [], // Array to store all rows of data
      currentPage: 1, // Current page for pagination
      rowsPerPage: 15, // Number of rows displayed per page
      selectedFile: null, // Currently selected file for upload
      searchQuery: "", // Search query for filtering table
      sortKey: "", // Column to sort by
      sortOrder: "asc", // Sorting order (ascending/descending)
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredData.length / this.rowsPerPage) || 1;
    },
    sortedData() {
      if (!this.sortKey) return this.filteredData;

      return [...this.filteredData].sort((a, b) => {
        const valueA = a[this.csvHeaders.indexOf(this.sortKey)];
        const valueB = b[this.csvHeaders.indexOf(this.sortKey)];

        // Convert numeric fields to numbers for correct sorting
        const numericFields = ["id", "Longitude", "Latitude", "Year_Built", "Total_Available_Space", "Rent_SF_Yr", "last_updated"];
        const isNumeric = numericFields.includes(this.sortKey);

        let comparison = isNumeric ? Number(valueA) - Number(valueB) : String(valueA).localeCompare(String(valueB));

        return this.sortOrder === "asc" ? comparison : -comparison;
      });
    },
    paginatedSortedData() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.sortedData.slice(start, end);
    },

    filteredData() {
      if (!this.searchQuery) return this.csvData;
      return this.csvData.filter((row) =>
        row.some((value) => value.toString().toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    },
    paginatedFilteredData() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredData.slice(start, end);
    },
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
    sortTable(column) {
      if (this.sortKey === column) {
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        this.sortKey = column;
        this.sortOrder = "asc";
      }
    },
    highlightMatch(value) {
      if (!this.searchQuery || typeof value !== "string") return value;
      const regex = new RegExp(`(${this.searchQuery})`, "gi");
      const highlighted = value.toString().replace(regex, `<span class="highlight">$1</span>`);
      return highlighted;
    },
    clearSearch() {
      this.searchQuery = "";
    }, async spatialMerge() {
      try {
        const response = await axios.post(`http://127.0.0.1:8000/spatial-join`, {});
        alert("API called successfully: " + response.data.statusCode);
      } catch (error) {
        console.error("Error calling API:", error);
        alert("Failed to call API");
      }
    },
    async downloadTAD() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/download-tad`);
        alert("API called successfully: " + response.data.statusCode);
      } catch (error) {
        console.error("Error calling API:", error);
        alert("Failed to call API");
      }
    },
    async showTable() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/get-data/");
        if (response.data.status === "success") {
          this.csvHeaders = Object.keys(response.data.data[0]);
          this.csvData = response.data.data.map((row) =>
            Object.values(row).map((cell) => (cell !== null ? cell : "N/A"))
          );
          this.currentPage = 1;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data.");
      }
    },
    goback() {
      router.push("/home");
    },
    handleFileSelection(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadFile() {
      if (this.selectedFile) {
        const file = this.selectedFile;
        const fileName = this.selectedFile.name;

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const bucketName = 'CoStarCSV';

        const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${fileName}`;

        const response = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${supabaseKey}`,
            "Content-Type": "text/csv"
          },
          body: file
        });

        if (response.ok) {
          console.log("File uploaded successfully!");
        } else {
          console.error("Upload failed", await response.text());
        }
      } else {
        alert("Please select a file to upload.");
      }
    },
    async processVacanciesReport() {
      if (!this.selectedFile) {
        alert("Please select a file to process.");
      } else {
        try {
          const response = await axios.post("http://127.0.0.1:8000/process-costar-file/");
          alert(response.data.message);
        } catch (error) {
          console.error("Error processing file:", error.message);
          alert("An error occurred while processing the file.");
        }
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    async downloadVacanciesReport() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/export-csv/", {
          responseType: "blob",
        });
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "master_vacancy_table.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading CSV:", error);
        alert("Failed to download CSV.");
      }
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

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
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
  color: #2c3e50;
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
  color: #2c3e50;            /* Text color stays dark */
  transform: scale(1.05);    /* Adds the zoom effect */
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