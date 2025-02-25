<template>
    <div class="grid grid-cols-8 h-screen bg-[#fff]">
      <Sidebar @sidebarToggle="handleSidebarToggle" />
  
      <div
        :class="[
          'col-start-2 col-span-6 flex flex-col h-screen p-8 bg-[#fff] rounded-lg shadow-inner flex-grow mx-auto justify-start items-center mt-8',
          { shifted: isSidebarOpen },
        ]"
      >
        <h2 class="title text-3xl font-bold text-center text-[#231f20] mb-6">
          Excel Change Report Generator
        </h2>
  
        <div class="flex flex-col gap-4 items-center w-full max-w-2xl">
          <div>
            <label for="stageFile" class="block text-sm font-medium text-gray-700"
              >Upload Stage Excel File:</label
            >
            <input
              type="file"
              id="stageFile"
              @change="handleStageFileChange"
              accept=".xlsx, .xls"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
  
          <div>
            <label for="masterFile" class="block text-sm font-medium text-gray-700"
              >Upload Master Excel File:</label
            >
            <input
              type="file"
              id="masterFile"
              @change="handleMasterFileChange"
              accept=".xlsx, .xls"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
  
          <button
            @click="generateReport"
            :disabled="!stageFile || !masterFile"
            class="property-button w-full p-4 bg-[#fff] text-[#ffff] rounded-lg font-semibold shadow-md hover:bg-[#967444] hover:text-white transition-transform transform hover:scale-105 border border-gray-300"
          >
            Generate Report
          </button>
  
          <div v-if="reportUrl">
            <a
              :href="reportUrl"
              download="change_report.xlsx"
              class="property-button w-full p-4 bg-[#fff] text-[#ffff] rounded-lg font-semibold shadow-md hover:bg-[#967444] hover:text-white transition-transform transform hover:scale-105 border border-gray-300"
            >
              Download Report
            </a>
          </div>
  
          <div v-if="errorMessage">
            <p style="color: red">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import Sidebar from "./Sidebar.vue";
  
  export default {
    components: {
      Sidebar,
    },
    data() {
      return {
        stageFile: null,
        masterFile: null,
        reportUrl: null,
        errorMessage: null,
        isSidebarOpen: true,
      };
    },
    methods: {
      handleStageFileChange(event) {
        this.stageFile = event.target.files[0];
      },
      handleMasterFileChange(event) {
        this.masterFile = event.target.files[0];
      },
      async generateReport() {
        this.errorMessage = null;
        this.reportUrl = null;
  
        const formData = new FormData();
        formData.append("stageFile", this.stageFile);
        formData.append("masterFile", this.masterFile);
  
        try {
          const response = await axios.post(
            "http://localhost:8000/generate-change-report/",
            formData,
            {
              responseType: "blob", // Important: Receive binary data
            }
          );
  
          // Create a download link
          const url = window.URL.createObjectURL(new Blob([response.data]));
          this.reportUrl = url;
        } catch (error) {
          console.error("Error generating report:", error);
          this.errorMessage = "An error occurred while generating the report.";
          if (error.response && error.response.data) {
            try {
              const errorData = await error.response.data.text();
              const parsedError = JSON.parse(errorData);
              this.errorMessage = parsedError.error || this.errorMessage;
            } catch (e) {
              console.log("Error parsing json error message.", e);
            }
          }
        }
      },
      handleSidebarToggle(isOpen) {
        this.isSidebarOpen = isOpen;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Appraisal District Section */
  .col-start-2 {
    flex: 1;
    transition: transform 0.3s ease-in-out;
    transform: translateX(0px);
    font-family: "Sentinel – Book Aa", serif;
  }
  
  /* Shift back when sidebar is closed */
  .shifted {
    transform: translateX(120px);
  }
  
  /* Button List - Expand Width */
  .button-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    width: 100%;
    width: 500px;
  }
  
  /* Property Buttons */
  .property-button {
    width: 100%;
    width: 500px;
    padding: 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1.2rem;
    font-family: "Sentinel – Book Aa", serif;
    cursor: pointer;
    text-align: center;
    background-color: #231f20;
    color: #ffff;
    border: 1px solid #d8d2c4;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  .property-button:hover {
    background-color: #967444;
    color: white;
    transform: scale(1.05);
    border: none;
  }
  </style>