<template>
  <div class="card shadow border-light not-found">
    <div class="card-body">
      <div class="card w-75 text-center border-light my-5 m-auto mt-5">
        <p class="display-1 fw-bold">404</p>
        <p class="lead">{{ path }}</p>
        <p class="lead">Page not found</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();

const path = ref(route.path);
</script>

<style scoped>
.not-found {
  height: 100vh;
}

.not-found .card {
  height: 75vh;
}
</style>
