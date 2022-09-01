<template>
  <div aria-atomic="true" aria-live="polite">
    <div :class="toastPlacement" class="toast-container position-absolute p-3">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { TOP_RIGHT } from "@/constants/toasts";

interface ToastContainerProps {
  placement?: string;
}

const props = defineProps<ToastContainerProps>();

const toastPlacement = computed(() =>
  props.placement ? props.placement : TOP_RIGHT
);
</script>

<style scoped>
.toast-container {
  z-index: 11;
}
</style>
