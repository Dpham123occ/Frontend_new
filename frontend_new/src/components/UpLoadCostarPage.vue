<template>
    <div>
        <h1>Upload Costar's Point</h1>
        <button class ="button" @click="upload">Upload</button> <br>
        <button class ="button" @click="goBack">Back</button>
    </div>
</template>

<script setup>
    import router from '../router/router';

    function goBack() {
        router.push('/home');
    }

    function upload() {
        alert('impelement your ');
    }
</script>

<style scoped>
button {
    margin: 10px;
}
</style>