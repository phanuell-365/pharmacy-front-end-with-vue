<template>
  <form class="row g-3 needs-validation m-4">
    <div v-for="k in 6" :key="k" class="col-md-4">
      <p class="form-label placeholder-glow">
        <span class="placeholder col-6"></span>
      </p>

      <p class="placeholder-glow">
        <input
          :id="`validation-${k}`"
          class="form-control bg-light shadow border-dark placeholder col-10"
          disabled
          readonly
        />
      </p>
    </div>
  </form>
</template>

<script lang="ts" setup></script>

<style scoped></style>
