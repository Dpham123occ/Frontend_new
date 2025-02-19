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
  right: 10px;
  background-color: #231f20;
  font-family: "Sentinel – Book Aa", serif;
  color: white;
  border: 1px solid #d8d2c4;
  padding: 10px 15px;
  cursor: pointer;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}
.download-btn:hover {
  background-color: #000000; /* black on hover */
  color: #ffffff !important; /* ensure text is white */
  transform: scale(1.05); /* optional: a little zoom effect */
}
</style>
