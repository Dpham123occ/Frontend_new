<template>
    <div class="main-container">
        <!-- Vertical Navigation Bar -->
        <div class="sidebar">
            <!-- Logo Section -->
            <div class="logo-section">
                <img src="../assets/TSBlack.png" alt="Trailspur Logo" class="logo" />
            </div>
            <nav class="nav-menu">
                <button class="nav-item underlined-item" @click="showTable('Tarrant')">Tarrant</button>
                <button class="nav-item underlined-item" @click="showTable('Dallas')">Dallas</button>
                <button class="nav-item underlined-item" @click="showTable('Collin')">Collin</button>
                <button class="nav-item underlined-item" @click="showTable('Harris')">Harris</button>
                <button class="nav-item underlined-item" @click="downloadTAD">Download TAD Parcel - Make James' API
                    call</button>
                <button class="nav-item back-button" @click="goback">Back</button>
            </nav>
        </div>

        <!-- Table and Buttons Section -->
        <div class="table-section">
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
            <div class="pagination-controls"
                v-if="selectedRegion && csvData[selectedRegion] && csvData[selectedRegion].length">
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
                <button @click="uploadFile" :disabled="!selectedFile || !uploadRegion">Upload Vacancies Report</button>
                <button>Download Vacancies Report</button>
            </div>
        </div>
    </div>
</template>

<script>
import router from '../router/router';
import * as XLSX from 'xlsx';
import axios from 'axios';

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
            currentPage: 1,
            rowsPerPage: 10,
            rowsPerPageOptions: [10, 20, 50],
            uploadRegion: "",
            districts: ['Tarrant', 'Dallas', 'Collin', 'Harris'],
            selectedFile: null
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
        async downloadTAD() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/download-tad`);
                const data = response.data;
                alert(data.statusCode);
            } catch (error) {
                console.error("Error calling api:", error);
                this.errorMessage = "Failed to call api";
            }
        },
        showTable(region) {
            this.selectedRegion = region;
        },
        goback() {
            router.push('/home');
        },
        handleFileSelection(event) {
            this.selectedFile = event.target.files[0];
        },
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

.sidebar {
    width: 220px;
    background-color: #d1dede;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    height: 100vh;
}

.logo-section {
    margin-bottom: 2rem;
}

.logo {
    width: 140px;
    height: auto;
    object-fit: contain;
}

.nav-menu {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.nav-item {
    padding: 0.5rem 1rem;
    background-color: transparent;
    border: none;
    color: #231f20;
    text-align: left;
    font-weight: bold;
    text-decoration: underline;
    font-size: 1.0rem;
    font-family: 'Brother 1816 Reg', sans-serif;
    cursor: pointer;
    width: calc(100% - 2rem);
    border-radius: 5px;
    margin-bottom: 1rem;
    transition: background-color 0.3s;
}

.nav-item:hover {
    background-color: #d8d2c4;
}

.back-button {
    margin-top: auto;
    background-color: #231f20;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    font-size: 0.9rem;
    width: calc(100% - 2rem);
    cursor: pointer;
    text-decoration: none;
    /* Ensures no underline is applied */
}

.back-button:hover {
    background-color: #000;
}
</style>
