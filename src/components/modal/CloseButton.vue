<template>
  <button
    :class="{ [`btn-${color}`]: color }"
    class="btn btn-sm"
    data-bs-dismiss="modal"
    type="button"
  >
    {{ text }}
  </button>
</template>

<script lang="ts" setup>
interface CloseButtonProps {
  color: string;
  text: string;
}

defineProps<CloseButtonProps>();
</script>

<style scoped></style>
