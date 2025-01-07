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
              <textarea
                v-model="notes[rowIndex + (currentPage - 1) * rowsPerPage]"
                placeholder="Add notes here"
                rows="2"
              ></textarea>
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
