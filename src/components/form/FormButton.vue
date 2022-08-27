<template>
  <div class="float-right">
    <button :type="type" class="btn btn-primary">{{ name }}</button>
  </div>
</template>

<script lang="ts" setup>
interface ButtonProps {
  type: string;
  name: string;
}

defineProps<ButtonProps>();
</script>

<style scoped></style>
