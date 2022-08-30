<template>
  <tr v-for="(record, index) in records" :key="record.id">
    <th scope="row">{{ index + 1 }}</th>
    <TableData :field-names="attributes" :record="record" />
  </tr>
</template>

<script lang="ts" setup>
import TableData from "./TableData.vue";
import { inject } from "vue";
import { attributesKey, recordsKey } from "@/keys";

const records = inject(recordsKey);
const attributes = inject(attributesKey);
</script>

<style scoped></style>
