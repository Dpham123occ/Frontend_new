<template>
  <div class="main-container">
    <div class="overflow-x-auto">
      <table class="table table-xs">
        <thead>
          <tr>
            <th v-for="(header, index) in csvHeaders" :key="index">{{ header }}</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
            <td v-for="(value, colIndex) in row" :key="colIndex">{{ value }}</td>
            <td>
              <textarea v-model="notes[rowIndex + (currentPage - 1) * rowsPerPage]" placeholder="Add notes here"
                rows="2"></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Table and Pagination Section -->
    <div class="table-section" v-if="csvHeaders.length && csvData.length">
      <!-- Conditionally Rendered Table for CSV Data -->
      <!-- Pagination Controls -->
      <div class="pagination-controls">
        <label for="rowsPerPage">Rows per page:</label>
        <select v-model="rowsPerPage" @change="resetPagination">
          <option v-for="option in rowsPerPageOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
     
        <!-- back button-->
     <div class="button-group">
      <button @click="goBack" class="back-button">Back</button>
    </div>

       <!-- Save Notes Button -->
       <div class="button-group">
        <button @click="saveNotes" class="save-button">Save Notes</button>
      </div>
    </div>
     
    

    <!-- Empty State -->
    <div v-else>
      <el-empty description="Upload a file to display data." />
    </div>
  </div>
</template>

<script>

// unsused: import axios from "axios";
import Papa from "papaparse";
import { supabase } from "../lib/supabase.js";

export default {
  name: "TableView",
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
        // Fetch data from Supabase
        let { data: master_acquisition_list, error } = await supabase
          .from("master_acquisition_list")
          .select("*");

        if (error) {
          throw error;
        }

        if (!master_acquisition_list || master_acquisition_list.length === 0) {
          console.warn("No data found in Supabase table.");
          alert("No data available.");
          return;
        }

        // Convert JSON to CSV format
        const csvString = Papa.unparse(master_acquisition_list);

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
  overflow-y: auto;  /* Enables vertical scrolling */
}


textarea {
  width: 100%;
  /* Ensures textarea spans the cell */
  resize: none;
  /* Prevents resizing */
  
  border-radius: 4px; /* Optional: add rounded corners */
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
  cursor: pointer; /* Change cursor to pointer when hovered */
  transform: scale(1.1);
}

/* Style for Previous and Next buttons with constant underline */
.pagination-controls button {
  text-decoration: underline; /* Underline is always present */
  cursor: default; /* Default cursor initially */
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
  background-color:#000000;
  transform: scale(1.05);
}
/* Add grid lines to the table */
table {
  border-collapse: collapse; /* Ensures no space between borders */
  width: 100%;
}

th, td {
  border: 1px solid black; /* Defines grid lines */
  padding: 8px; /* Adds some spacing inside cells */
  text-align: left; /* Aligns text to the left */
}

/* Optional: Add a border to the table itself */
table {
  border: 2px solid black;
  min-width: 100%; /* Ensures the table expands horizontally */
  border-collapse: collapse; /* Removes extra spacing */
}
/* Add horizontal scrolling */
.overflow-x-auto {
  overflow-x: auto; /* Enables horizontal scrolling */
  white-space: nowrap; /* Prevents table content from wrapping */
}
.overflow-y-auto{
  overflow-y: auto; /* Enables horizontal scrolling */
  white-space: nowrap;
}
/* Style for table headers */
th {
  background-color: #d3d3d3; /* Light grey background */
  color: black; /* Text color */
  font-weight: bold; /* Make header text bold */
  padding: 10px; /* Add spacing */
  text-align: left; /* Align text to the left */
  text-transform: uppercase;
  position: sticky;
  top: 0;
  z-index: 2; /* Ensure header stays above table rows */
 
}
/* Target the last column of the table */
table td:last-child, table th:last-child {
  width: 200px; /* Adjust the width as per your requirement */
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
  background-color:#000000;
  transform: scale(1.05);
}
.save-button, .back-button {
  width: 10%; /* Make both buttons the same width */
}




</style>
