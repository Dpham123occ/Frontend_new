<template>
    <div class="grid grid-cols-5 gap-2-px">
        <!-- Vertical Navigation Bar -->
        <div class="row-span-5 flex sidebar">
            <!-- Logo Section -->
            <div class="logo-section">
                <img src="../assets/TSBlack.png" alt="Trailspur Logo" class="logo" />
            </div>
            <nav class>
                <button class="btn nav-item" @click="showTable">Display Tarrant's Vacancies</button>
                <!-- <button class="nav-item underlined-item" @click="showTable('Dallas')">Dallas</button>
                <button class="nav-item underlined-item" @click="showTable('Collin')">Collin</button>
                <button class="nav-item underlined-item" @click="showTable('Harris')">Harris</button> -->
                <button class="nav-item" @click="downloadTAD">Download TAD Parcel </button>
                <button class="nav-item" @click="spatialMerge">Perform Spatial Merge</button>
                <button class="nav-item" @click="goback">Back</button>
            </nav>
        </div>

        <!-- Table and Buttons Section -->
        <div class="col-start-2 col-end-5 rows-start-1 rows-end-3">
            <table v-if="paginatedData.length" class="table table-s">
                <thead>
                    <tr>
                        <th v-for="(header, index) in csvHeaders" :key="index">{{ header }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
                        <td v-for="(value, colIndex) in row" :key="colIndex">{{ value }}</td>
                    </tr>
                </tbody>
            </table>
            <!-- Pagination Controls -->
            <div class="col-start-2 col-end-5 rows-start-4 rows-end-4 col-span-4 join" v-if="csvData.length">
                <label for="rowsPerPage">Rows per page:</label>
                <select v-model="rowsPerPage" @change="resetPagination">
                    <option v-for="option in rowsPerPageOptions" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>
                <button class="btn btn-s" @click="prevPage" :disabled="currentPage === 1">Previous</button>
                <span>Page {{ currentPage }} of {{ totalPages }}</span>
                <button class="btn btn-s" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
            </div>

            <!-- Upload & Download Buttons -->
            <div class="col-start-2 col-end-5 rows-start-5 rows-end-5 col-span-4 join">
                <!-- <label for="districtSelect">Select District:</label>
                <select v-model="uploadRegion" id="districtSelect">
                    <option disabled value="">Select a district</option>
                    <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
                </select> -->
                <input type="file" class="join-item file-input file-input-bordered" @change="handleFileSelection" accept=".xlsx, .xls, .csv" />
                <button class="btn btn-s join-item" @click="uploadFile">Upload Costar Vacancies
                    Report</button>
                <button class="btn btn-s join-item" @click="downloadVacanciesReport">Download Vacancies Report</button>
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
            rowsPerPage: 10, // Number of rows displayed per page
            rowsPerPageOptions: [10, 20, 50], // Options for rows per page
            selectedFile: null, // Currently selected file for upload
        };
    },
    computed: {
        paginatedData() {
            // Compute rows to display based on the current page and rows per page
            const start = (this.currentPage - 1) * this.rowsPerPage;
            const end = start + this.rowsPerPage;
            return this.csvData.slice(start, end);
        },
        totalPages() {
            // Calculate the total number of pages
            return Math.ceil(this.csvData.length / this.rowsPerPage) || 1;
        },
    },
    methods: {
        async spatialMerge() {
            try {
                const response = await axios.post(`http://127.0.0.1:8000/spatial-join`, {});
                const data = response.data;
                alert("The api has been successfully called with status code:" + data.statusCode);
            } catch (error) {
                console.error("Error calling API:", error);
                alert("Failed to call API");
            }
        },
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

                    // Reset pagination
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
        },
        async downloadVacanciesReport() {
            try {
                // Send request to the backend to get the CSV file
                const response = await axios.get("http://127.0.0.1:8000/export-csv/", {
                    responseType: "blob", // Ensure the response is treated as a binary blob
                });

                // Create a URL for the blob
                const blob = new Blob([response.data], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);

                // Create a temporary link element
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "master_vacancy_table.csv"); // Set the file name

                // Append the link to the document, trigger the download, and clean up
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Revoke the URL to free memory
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error downloading CSV:", error);
                alert("Failed to download CSV.");
            }
        },
    }
};
</script>


<style scoped>


.sidebar {
    width: 220px;
    background-color: #d1dede;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    height:100vh;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
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

.table-section {
  margin-top: 20px;
}

.pagination-controls {
    margin-top: 20px;
}
</style>
