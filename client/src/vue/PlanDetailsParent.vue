<script setup>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
import PlanDetails from './PlanDetails.vue';
import { ref } from 'vue';

const ingredients = ref({});
const title = ref('');

const displayList = (args) => {
  ingredients.value = args[0];
  title.value = args[1];
};

const printShoppingList = () => {
  window.print();
}
</script>

<template>
  <PlanDetails @list="displayList" v-if="Object.keys(ingredients).length === 0" />

  <div class="container mt-2" v-else>
    <div class="row justify-content-between align-items-center">
      <div class="col">
        <h1 class="fw-bold">Shopping list: {{ title }}</h1>
      </div>
      <div class="col">
        <button class="btn btn-primary float-end" @click="ingredients = {}">Back to plan</button>
        <button class="btn btn-outline-primary float-end me-1" @click="printShoppingList">Print</button>
      </div>
    </div>
    <div class="mt-4">
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Amount</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in ingredients" :key="index">
            <td>{{ item.name }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.unit }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@media print {

  /* Hide everything except the shopping list */
  body * {
    visibility: hidden;
  }

  #shopping-list,
  #shopping-list * {
    visibility: visible;
  }

  #shopping-list {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  /* Optional: hide buttons or navigation */
  button,
  nav,
  footer {
    display: none !important;
  }

  /* Optional: make it black & white and remove box shadows */
  .table {
    box-shadow: none;
    color: #000;
    background: #fff;
  }

  .table th,
  .table td {
    border-color: #000;
  }
}
</style>