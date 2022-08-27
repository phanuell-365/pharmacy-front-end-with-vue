<template>
  <p :id="`heading${name}`" class="accordion-header my-1">
    <a
      :aria-controls="`collapse${name}`"
      :aria-expanded="ariaExpanded"
      :class="{ 'btn-success': active }"
      :href="`#${id}`"
      class="btn d-block text-start"
      data-bs-toggle="collapse"
      role="button"
    >
      <i :class="icon" class="py-1"></i>
      {{ name }}
    </a>
  </p>
</template>

<script lang="ts" setup>
import { computed } from "vue";

interface SubmenuTitleProps {
  name: string;
  active: boolean;
  icon: string;
  id: string;
}

const props = defineProps<SubmenuTitleProps>();

const ariaExpanded = computed(() => {
  return props.active ? "true" : "false";
});
</script>

<style scoped></style>
