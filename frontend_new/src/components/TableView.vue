<template>
  <div class="main-container">
    <div class="overflow-x-auto">
      <table class="table table-xs">
        <thead>
          <tr>
            <th v-for="(header, index) in csvHeaders" :key="index">{{ header }}</th>
            <th>Contacted Owner?</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
            <td v-for="(value, colIndex) in row" :key="colIndex">{{ value }}</td>
            <td>
              <input 
                type="checkbox" 
                v-model="contacted[rowIndex + (currentPage - 1) * rowsPerPage]"
                class="contacted-checkbox"
              >
            </td>
            <td>
              <button 
                @click="openNotesModal(rowIndex + (currentPage - 1) * rowsPerPage)"
                class="notes-button"
              >
                View/Edit Notes
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Notes Modal -->
    <div v-if="showNotesModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Edit Notes</h3>
        <textarea 
          v-model="currentNote" 
          class="modal-textarea" 
          placeholder="Enter your notes here"
          rows="5"
        ></textarea>
        <div class="modal-buttons">
          <button @click="saveCurrentNote" class="save-button">Save</button>
          <button @click="closeNotesModal" class="cancel-button">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Rest of your existing code (pagination, etc.) -->
    <div class="table-section" v-if="csvHeaders.length && csvData.length">
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

      <div class="button-group">
        <button @click="goBack" class="back-button">Back</button>
      </div>

      <div class="button-group">
        <button @click="saveNotes" class="save-button">Save Notes</button>
      </div>
    </div>

    <div v-else>
      <el-empty description="Upload a file to display data." />
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
      required: true,
    },
  },
  data() {
    return {
      csvHeaders: [],
      csvData: [],
      notes: [],
      contacted: [],
      currentPage: 1,
      rowsPerPage: 10,
      rowsPerPageOptions: [10, 20, 50],
      // Modal related data
      showNotesModal: false,
      currentNote: "",
      currentNoteIndex: -1
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
    openNotesModal(index) {
      this.currentNoteIndex = index;
      this.currentNote = this.notes[index] || "";
      this.showNotesModal = true;
    },
    closeNotesModal() {
      this.showNotesModal = false;
    },
    saveCurrentNote() {
      if (this.currentNoteIndex >= 0) {
        this.$set(this.notes, this.currentNoteIndex, this.currentNote);
      }
      this.closeNotesModal();
    },
    goBack() {
      window.history.back();
    },
    async fetchCSVFile() {
      try {
        let { data, error } = await supabase
          .from(this.tableName)
          .select("*");

        if (error) {
          throw error;
        }

        if (!data || data.length === 0) {
          console.warn("No data found in Supabase table.");
          alert("No data available.");
          return;
        }

        const csvString = Papa.unparse(data);

        Papa.parse(csvString, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            this.csvHeaders = results.meta.fields;
            this.csvData = results.data;
            this.contacted = new Array(this.csvData.length).fill(false);
            this.notes = new Array(this.csvData.length).fill("");
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
      console.log("Contacted Status:", this.contacted);
      alert("Notes and contacted status saved successfully!");
    },
  },
  mounted() {
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
  resize: none;
  border-radius: 4px;
  border: 1px solid #ccc;
  height: 100%;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.pagination-controls button:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.pagination-controls button {
  text-decoration: underline;
  cursor: default;
  font-weight: bold;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.save-button, .back-button {
  padding: 10px 20px;
  background-color: #000000;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  width: 10%;
}

.save-button:hover, .back-button:hover {
  background-color: #000000;
  transform: scale(1.05);
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

table {
  border: 2px solid black;
  min-width: 100%;
  border-collapse: collapse;
}

.overflow-x-auto {
  overflow-x: auto;
  white-space: nowrap;
}

th {
  background-color: #d3d3d3;
  color: black;
  font-weight: bold;
  padding: 10px;
  text-align: left;
  text-transform: uppercase;
}

/* Style for the contacted checkbox */
.contacted-checkbox {
  width: 20px;
  height: 20px;
  margin: 0 auto;
  display: block;
}

.fixed-textarea {
  width: 20vw;
  height: 10vh;
  resize: none;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 8px;
}

/* Notes Button Style */
.notes-button {
  padding: 6px 12px;
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.notes-button:hover {
  background-color: #2d3748;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 10px 0;
  resize: vertical;
  min-height: 100px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.modal-buttons button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  min-width: 80px; /* Add minimum width to ensure consistent sizing */
  height: 36px; /* Fixed height for both buttons */
  box-sizing: border-box; /* Include padding and border in the element's total dimensions */
  font-size: 14px; /* Consistent font size */
  line-height: 1; /* Reset line height */
}

.modal-buttons .save-button {
  background-color: #000000;
  color: white;
  border: none;
}

.modal-buttons .save-button:hover {
  background-color: #444445;
}

.modal-buttons .cancel-button {
  background-color: #e2e8f0;
  border: 1px solid #cbd5e0;
}

.modal-buttons .cancel-button:hover {
  background-color: #cbd5e0;
}
/* Keep your existing table styles */
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #d3d3d3;
  color: black;
  font-weight: bold;
  padding: 10px;
  text-transform: uppercase;
}

.contacted-checkbox {
  width: 20px;
  height: 20px;
  margin: 0 auto;
  display: block;
}
</style>