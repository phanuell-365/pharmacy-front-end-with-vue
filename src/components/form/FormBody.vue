<template>
  <form
    class="row g-3 needs-validation m-4"
    novalidate
    @submit.prevent="onFormSubmit($event)"
  >
    <slot name="input"></slot>
    <div>
      <slot name="button"></slot>
    </div>
  </form>
</template>

<script lang="ts" setup>
const emits = defineEmits(["formSubmit"]);

const onFormSubmit = (event: Event) => {
  emits("formSubmit", event);
};
</script>

<style scoped></style>
