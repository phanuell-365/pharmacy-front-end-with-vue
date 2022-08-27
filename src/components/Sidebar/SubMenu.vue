<template>
  <RouterLink
    :aria-current="ariaCurrent"
    :class="{ 'bg-success text-light': active }"
    :to="href"
    class="ms-2 fs-6 list-group-item list-group-item-action rounded"
  >
    <i :class="icon" aria-hidden="true" class="me-1"></i>
    {{ description }}
  </RouterLink>
</template>

<script lang="ts" setup>
import { computed } from "vue";

interface SubMenuProps {
  description: string;
  icon: string;
  href: string;
  active: boolean;
}

const props = defineProps<SubMenuProps>();

const ariaCurrent = computed(() => {
  return props.active ? "true" : "false";
});
</script>

<style scoped></style>
