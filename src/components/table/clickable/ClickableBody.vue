<template>
  <tbody>
    <ClickableRow />
  </tbody>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from "vue";

const ClickableRow = defineAsyncComponent(() => import("./ClickableRow.vue"));
</script>

<style scoped></style>
