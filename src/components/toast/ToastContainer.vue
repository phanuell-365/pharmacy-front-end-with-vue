<template>
  <div aria-atomic="true" aria-live="polite" class="position-relative">
    <!-- Position it: -->
    <!-- - `.toast-container` for spacing between toasts -->
    <!-- - `.position-absolute`, `top-0` & `end-0` to position the toasts in the upper right corner -->
    <!-- - `.p-3` to prevent the toasts from sticking to the edge of the container  -->
    <div class="toast-container position-absolute top-0 end-0 p-3">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
