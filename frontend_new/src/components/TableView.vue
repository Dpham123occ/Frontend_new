<template>
  <div class="main-container">
    <!-- Table and Pagination Section -->
    <div class="table-section" v-if="csvHeaders.length && csvData.length">
      <!-- Conditionally Rendered Table for CSV Data -->
      <table class="csv-table">
        <caption>Uploaded Data</caption>
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
              <textarea
                v-model="notes[rowIndex + (currentPage - 1) * rowsPerPage]"
                placeholder="Add notes here"
                rows="2"
              ></textarea>
            </td>
          </tr>
        </tbody>
      </table>

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
import axios from "axios";
import Papa from "papaparse";

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
    async fetchCSVFile() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/fetch-csv-all/", {
          responseType: "blob", // Ensure response is treated as a binary file
        });

        // Read the file content using PapaParse
        const reader = new FileReader();
        reader.onload = () => {
          Papa.parse(reader.result, {
            header: true, // Extract headers dynamically
            skipEmptyLines: true, // Skip empty rows
            complete: (results) => {
              this.csvHeaders = results.meta.fields; // Extract headers
              this.csvData = results.data; // Extract rows
              this.resetPagination();
            },
          });
        };
        reader.readAsText(response.data);
      } catch (error) {
        console.error("Error fetching CSV file:", error);
        alert("Failed to load CSV file.");
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

.csv-table {
  width: 100%;
  height: 70vh;
  border-collapse: collapse; /* Removes gaps between borders */
  table-layout: auto; /* Allows column widths to adjust dynamically based on content */
}

.csv-table th,
.csv-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  white-space: nowrap; /* Prevents text wrapping */
  overflow: hidden; /* Ensures no content overflow */
}

.csv-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  position: sticky;
  top: 0; /* Keeps the header at the top */
  z-index: 1; /* Ensures the header is above content */
}

.csv-table tbody {
  max-height: 50vh; /* Limits the table body height */
  overflow-y: auto; /* Adds vertical scrolling */
  overflow-x: auto; /* Enables vertical scrolling */
}

.csv-table tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* Alternating row colors for readability */
}

.csv-table tbody tr:hover {
  background-color: #f1f1f1; /* Highlights the row on hover */
}

textarea {
  width: 100%; /* Ensures textarea spans the cell */
  resize: none; /* Prevents resizing */
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

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.save-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.save-button:hover {
  background-color: #45a049;
}
</style>
