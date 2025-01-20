<script setup>
import axios from 'axios';

const fetchRecipes = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3000/recipes');
    console.log(response.data);
  } catch (err) {
    console.error(err.message);
  }
};

fetchRecipes();
</script>

<template>

</template>

<style scoped>

</style>
