<template>
    <div class="main-container">
        <!-- Vertical Navigation Bar -->
        <div class="sidebar">
            <!-- Logo Section -->
            <div class="logo-section">
                <img src="../assets/TSBlack.png" alt="Trailspur Logo" class="logo" />
            </div>
            <nav class="nav-menu">
                <button class="nav-item underlined-item" @click="showTable">Tarrant</button>
                <!-- <button class="nav-item underlined-item" @click="showTable('Dallas')">Dallas</button>
                <button class="nav-item underlined-item" @click="showTable('Collin')">Collin</button>
                <button class="nav-item underlined-item" @click="showTable('Harris')">Harris</button> -->
                <button class="nav-item underlined-item" @click="downloadTAD">Download TAD Parcel - Make James' API
                    call</button>
                <button class="nav-item underlined-item" @click="spatialMerge">Perform Spatial Merge</button>
                <button class="nav-item back-button" @click="goback">Back</button>
            </nav>
        </div>

        <!-- Table and Buttons Section -->
        <div class="table-section">
            <table v-if="csvData.length" class="csv-table">
                <thead>
                    <tr>
                        <th v-for="(header, index) in csvHeaders" :key="index">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in csvData" :key="rowIndex">
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
                <!-- <label for="districtSelect">Select District:</label>
                <select v-model="uploadRegion" id="districtSelect">
                    <option disabled value="">Select a district</option>
                    <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
                </select> -->
                <input type="file" @change="handleFileSelection" accept=".xlsx, .xls, .csv" />
                <button @click="uploadFile" :disabled="!selectedFile">Upload Costar Vacancies
                    Report</button>
                <button>Download Vacancies Report</button>
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
            districts: ["Tarrant", "Dallas", "Collin", "Harris"],
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
                alert("The api has been successfully called with status code:" + data.statusCode);
            } catch (error) {
                console.error("Error calling API:", error);
                alert("Failed to call API");
            }
        },
        async showTable() {
            try {
                const response = await axios.get("http://127.0.0.1:8000/get-data/");
                if (response.data.status === "success") {
                    // Populate headers dynamically from the first row
                    this.csvHeaders = Object.keys(response.data.data[0]);

                    // Populate table rows
                    this.csvData = response.data.data.map((row) =>
                        Object.values(row).map((cell) => (cell !== null ? cell : "N/A"))
                    );
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
            if (!this.uploadRegion) {
                alert("Please select a district before uploading.");
                return;
            }
            if (this.selectedFile) {
                const formData = new FormData();
                formData.append("file", this.selectedFile);

                try {
                    const response = await axios.post(
                        "http://127.0.0.1:8000/upload-excel/",
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        }
                    );
                    alert(response.data.message);
                } catch (error) {
                    console.error("Error uploading Excel file", error.message);
                    alert("An error occurred while uploading the file.");
                }
            } else {
                alert("Please select a file to upload.");
            }
        },
        parseCSV(data, region) {
            if (!region) return;

            const rows = data.trim().split("\n");
            const parsedRows = rows.map((row) =>
                row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map((cell) =>
                    cell.startsWith('"') && cell.endsWith('"')
                        ? cell.slice(1, -1).replace(/""/g, '"') // Handle quoted fields
                        : cell
                )
            );

            this.csvHeaders[region] = parsedRows[0] || [];
            this.csvData[region] = parsedRows.slice(1).map((row) =>
                (row || []).map((cell) => (cell?.trim() ? cell.trim() : "N/A"))
            );

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
