<template>
  <div class="main-container">
    <!-- File Upload Section -->
    <div class="upload-section">
      <input type="file" @change="handleFileSelection" accept=".xlsx, .xls, .csv" />
    </div>

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
import * as XLSX from "xlsx";

export default {
  name: "AppraisalTable",
  data() {
    return {
      csvHeaders: [], // Array to store headers
      csvData: [], // Array to store rows of data
      notes: [], // Array to store notes for each row
      currentPage: 1, // Current page for pagination
      rowsPerPage: 10, // Rows displayed per page
      rowsPerPageOptions: [10, 20, 50], // Options for pagination
      selectedFile: null, // Currently selected file
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
    handleFileSelection(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.uploadFile();
      }
    },
    uploadFile() {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        this.parseCSV(csv);
      };
      reader.readAsArrayBuffer(this.selectedFile);
    },
    parseCSV(data) {
      const rows = data.trim().split("\n");
      this.csvHeaders = rows[0].split(",");
      this.csvData = rows.slice(1).map((row) => row.split(","));
      this.notes = Array(this.csvData.length).fill(""); // Initialize notes for each row
      this.resetPagination();
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
  border-collapse: collapse;
}

.csv-table th,
.csv-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.csv-table th {
  background-color: #f2f2f2;
  font-weight: bold;
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
