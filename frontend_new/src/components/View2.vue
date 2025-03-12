<template>
  <div class="grid grid-cols-8 h-screen bg-white">
    <Sidebar @sidebarToggle="handleSidebarToggle" />

    <div
      :class="[
        'col-start-2 col-span-6 flex flex-col h-screen p-8 bg-white rounded-lg shadow-inner flex-grow mx-auto justify-start items-center mt-8',
        { shifted: isSidebarOpen },
      ]"
    >
      <h2 class="title text-3xl font-bold text-center text-[#231f20] mb-6">
        Acquisition List Change Report Generator
      </h2>

      <div class="button-list">
        <button @click="generateReport" class="property-button">
          Generate Report
        </button>

        <div v-if="errorMessage">
          <p class="error-message">{{ errorMessage }}</p>
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
      reportUrl: null,
      errorMessage: null,
      isSidebarOpen: true,
    };
  },
  methods: {
    async generateReport() {
      this.errorMessage = null;

      try {
        // Make the GET request to the Lambda function URL
        const response = await axios.get(
          "https://mywi1gh4w2.execute-api.us-east-1.amazonaws.com/dev/generate-change-report",
          { responseType: "json" } // Expect a JSON response containing base64 data
        );

        // Extract base64-encoded file data from the response
        const base64Data = response.data.body;
        
        // Decode the base64 string into a binary string
        const binaryData = atob(base64Data); 

        // Convert the binary string to an ArrayBuffer
        const byteArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          byteArray[i] = binaryData.charCodeAt(i);
        }

        // Create a Blob from the binary data
        const blob = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Create a temporary download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "change_report.xlsx"; // Default file name or extracted filename from headers

        // Programmatically click the link to start the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke the object URL after the download
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error generating report:", error);
        this.errorMessage = "An error occurred while generating the report.";
      }
    },


    handleSidebarToggle(isOpen) {
      this.isSidebarOpen = isOpen;
    },
  },
};
</script>

<style scoped>
/* Sidebar Shift Effect */
.shifted {
  transform: translateX(120px);
  transition: transform 0.3s ease-in-out;
}

/* Button List Styling */
.button-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%;
  max-width: 500px;
}

/* Report Generation Button */
.property-button {
  width: 100%;
  padding: 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.2rem;
  cursor: pointer;
  text-align: center;
  background-color: #231f20;
  color: white;
  border: 1px solid #d8d2c4;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.property-button:hover {
  background-color: #967444;
  transform: scale(1.05);
  border: none;
}

/* Error Message Styling */
.error-message {
  color: red;
  font-weight: 600;
}
</style>