<template>
  <RouterLink
    :class="{
      [`btn-outline-${color}`]: outline,
      [`btn-${color}`]: !outline,
      [`btn-${size}`]: size,
    }"
    :role="role"
    :to="to"
    class="btn"
  >
    <i :class="icon"></i>
    {{ text }}
  </RouterLink>
</template>

<script lang="ts" setup>
interface ButtonProps {
  to: string;
  role?: string;
  text?: string;
  color: string;
  outline?: boolean;
  icon: string;
  name: string;
  size?: string;
}

defineProps<ButtonProps>();
</script>

<style scoped></style>
