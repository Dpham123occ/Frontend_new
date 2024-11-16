<template>
    <div>
        <h1>Upload Costar's Points</h1>
        <button class ="button" @click="upload">Upload</button>
    </div>
    <div><h1>Upload Appraisal District Data</h1>
        <button class ="button" @click="upload">Upload</button>
    </div>
    <div><button class ="button" @click="goBack">Back</button></div>
</template>

<script setup>
    import router from '../router/router';

    function goBack() {
        router.push('/home');
    }

    function upload() {
        alert('impelement your upload api here');
    }
</script>

<style scoped>
button {
    margin: 10px;
}
</style>