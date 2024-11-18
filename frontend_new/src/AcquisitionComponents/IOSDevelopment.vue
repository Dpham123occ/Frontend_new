<script>
export default {
  name: 'LightIndustrialMT',
  data() {
    return {
      csvData: [], // Global CSV data
      csvHeaders: [], // Headers for the CSV data
      selectedFile: null,
      currentPage: 1,
      rowsPerPage: 10,
      rowsPerPageOptions: [5, 10, 15, 20],
    };
  },
  computed: {
    paginatedData() {
      if (!this.csvData.length) return [];
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.csvData.slice(start, end);
    },
    totalPages() {
      if (!this.csvData.length) return 1;
      return Math.ceil(this.csvData.length / this.rowsPerPage);
    }
  },
  methods: {
    handleFileSelection(event) {
      this.selectedFile = event.target.files[0]; // Store selected file
    },
    uploadFile() {
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const csv = XLSX.utils.sheet_to_csv(worksheet);
          this.parseCSV(csv);
        };
        reader.readAsArrayBuffer(this.selectedFile);
      } else {
        alert('Please select a file to upload.');
      }
    },
    parseCSV(data) {
      const rows = data.trim().split('\n');
      this.csvHeaders = rows[0].split(',');
      this.csvData = rows.slice(1).map(row => row.split(','));

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
