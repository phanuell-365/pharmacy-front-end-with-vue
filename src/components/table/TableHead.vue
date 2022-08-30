<template>
  <thead class="bg-success text-light">
    <tr>
      <TableHeader :field-names="fieldNames" scope="col" />
    </tr>
  </thead>
</template>

<script lang="ts" setup>
import TableHeader from "./TableHeader.vue";
import { inject } from "vue";
import { attributesKey } from "@/keys";

const fieldNames = inject(attributesKey);
</script>

<style scoped></style>
