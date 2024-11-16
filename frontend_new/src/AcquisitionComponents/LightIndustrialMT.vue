<template>
  <div class="light-industrial-mt">
    <h1>Light Industrial Multi-Tenant</h1>
    <p>Welcome to the Light Industrial Multi-Tenant page! Use the table below to upload and manage your data.</p>

    <!-- Use TableView Component -->
    <TableView />
  </div>
</template>

<script>
import TableView from "../components/TableView.vue"; // Adjust the path to your TableView component

export default {
  name: "LightIndustrialMT",
  components: {
    TableView,
  },
};
</script>

<style scoped>
.light-industrial-mt {
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 2rem;
  color: #231F20; /* black-iron */
}

p {
  font-size: 1.2rem;
  color: #967444; /* bronze-leather */
}
</style>
