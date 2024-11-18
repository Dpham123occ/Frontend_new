
<template>
    <div class="main-container">
        <!-- Vertical Navigation Bar -->
        <div class="vertical-nav">
            <ul>
                <li><button @click="showTable('Tarrant')">Tarrant</button></li>
                <li><button @click="showTable('Dallas')">Dallas</button></li>
                <li><button @click="showTable('Collin')">Collin</button></li>
                <li><button @click="showTable('Harris')">Harris</button></li>
                <li><button v-on:click="goback">Go Back</button></li>
            </ul>
        </div>


        <!-- Table and Buttons Section -->
        <div class="table-section">
            <!-- Conditionally Rendered Table for CSV Data -->
            <table v-if="selectedRegion && csvData[selectedRegion] && csvData[selectedRegion].length" class="csv-table">
                <caption>{{ selectedRegion }} Data</caption>
                <thead>
                    <tr>
                        <th v-for="(header, index) in csvHeaders[selectedRegion]" :key="index">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
                        <td v-for="(value, colIndex) in row" :key="colIndex">{{ value }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination Controls -->
            <div class="pagination-controls" v-if="selectedRegion && csvData[selectedRegion] && csvData[selectedRegion].length">
                <label for="rowsPerPage">Rows per page:</label>
                <select v-model="rowsPerPage" @change="resetPagination">
                    <option v-for="option in rowsPerPageOptions" :key="option" :value="option">{{ option }}</option>
                </select>
                
                <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
                <span>Page {{ currentPage }} of {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
            </div>

            <!-- Upload & Download Buttons -->
            <div class="button-group">
                <label for="districtSelect">Select District:</label>
                <select v-model="uploadRegion" id="districtSelect">
                    <option disabled value="">Select a district</option>
                    <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
                </select>

                <input type="file" @change="handleFileSelection" accept=".xlsx, .xls, .csv" />

                <button @click="uploadFile" :disabled="!selectedFile || !uploadRegion">Upload</button>

                <button>Download Report</button>

            </div>
        </div>
    </div>
</template>

<script>
import router from '../router/router';
import * as XLSX from 'xlsx';

export default {
    name: 'AppraisalDistrict',
    data() {
        return {
            selectedRegion: null,
            csvHeaders: {
                Tarrant: [],
                Dallas: [],
                Collin: [],
                Harris: []
            },
            csvData: {
                Tarrant: [],
                Dallas: [],
                Collin: [],
                Harris: []
            },
            currentPage: 1,          // Current page number
            rowsPerPage: 10,         // Default rows per page
            rowsPerPageOptions: [10, 20, 50], // Options for rows per page
            uploadRegion: "",        // Selected region for uploading file
            districts: ['Tarrant', 'Dallas', 'Collin', 'Harris'], // List of districts
            selectedFile: null       // Temporarily stores the selected file
        };
    },
    computed: {
        paginatedData() {
            if (!this.selectedRegion || !this.csvData[this.selectedRegion]) return [];
            const start = (this.currentPage - 1) * this.rowsPerPage;
            const end = start + this.rowsPerPage;
            return this.csvData[this.selectedRegion].slice(start, end);
        },
        totalPages() {
            if (!this.selectedRegion || !this.csvData[this.selectedRegion]) return 1;
            return Math.ceil(this.csvData[this.selectedRegion].length / this.rowsPerPage);
        }
    },
    methods: {
        showTable(region) {
            this.selectedRegion = region;
        },
        goback() {
            router.push('/home');
        },
        handleFileSelection(event) {
            this.selectedFile = event.target.files[0]; // Store selected file
        },
        //in the future will change is into a post request
        uploadFile() { 
            if (!this.uploadRegion) {
                alert('Please select a district before uploading.');
                return;
            }
            if (this.selectedFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const csv = XLSX.utils.sheet_to_csv(worksheet);
                    this.parseCSV(csv, this.uploadRegion);
                };
                reader.readAsArrayBuffer(this.selectedFile);
            } else {
                alert('Please select a file to upload.');
            }
        },
        parseCSV(data, region) {
            if (!region) return;

            const rows = data.trim().split('\n');
            this.csvHeaders[region] = rows[0].split(',');
            this.csvData[region] = rows.slice(1).map(row => row.split(','));

            // Reset pagination for the newly uploaded data
            this.resetPagination();
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        resetPagination() {
            this.currentPage = 1;
        }
    }
};
</script>

<style scoped>
.main-container {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 20px;
}

.vertical-nav {
    width: 100%;
}

.vertical-nav ul {
    list-style-type: none;
    padding: 50px;
    margin: 0;
}

.vertical-nav li {
    margin-bottom: 10px;
}

.vertical-nav button {
    width: 100%;
    padding: 10px;
    text-align: left;
    border: none;
    background-color: #f0f0f0;
    cursor: pointer;
    transition: background-color 0.3s;
}

.vertical-nav button:hover {
    background-color: #dcdcdc;
}

.table-section {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 50px;
}

.button-group {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 10px 0;
}

.csv-table {
    width: 100%;
    border-collapse: collapse;
}

.csv-table th, .csv-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.csv-table th {
    background-color: #f2f2f2;
    font-weight: bold;
}
</style>
