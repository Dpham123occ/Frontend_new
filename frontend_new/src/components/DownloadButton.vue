<template>
    <button class="download-btn" @click="downloadReport">
      Download Delta Report
    </button>
  </template>
  
  <script>
  //import { fetchDeltaReport } from "@/services/apiService";
  
  export default {
    methods: {
      downloadReport() {
        fetchDeltaReport();
      },
    },
  };
  </script>
  
  <style scoped>
  .download-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #231f20;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  }
  
  .download-btn:hover {
    background-color: #231f20;
  }
  </style>
  