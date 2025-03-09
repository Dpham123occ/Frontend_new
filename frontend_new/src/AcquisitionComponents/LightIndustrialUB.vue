<template>
  <div class="light-industrial-mt">
    <h1>Light Industrial User Buildings</h1>
    <p>Welcome to the Light Industrial User Buildings page! Use the table below to upload and manage your data.</p>
    <!-- Use TableView Component -->
    <TableView tableName="industrial_user_buildings"/>
  </div>
</template>

<script>
import TableView from "../components/TableView.vue"; // Adjust the path to your TableView component

export default {
  name: "LightIndustrialMB",
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
