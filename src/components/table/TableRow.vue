<template>
  <template v-if="records?.length > 0">
    <tr v-for="(record, index) in records" :key="record.id" tabindex="0">
      <th scope="row">{{ index + 1 }}</th>
      <TableData :field-names="attributes" :record="record" />
    </tr>
  </template>
  <template v-else>
    <tr>
      <td :colspan="colspan">
        <p class="lead text-center m-auto">No data to display</p>
      </td>
    </tr>
  </template>
</template>

<script lang="ts" setup>
import TableData from "./TableData.vue";
import { computed, inject } from "vue";
import { attributesKey, recordsKey } from "@/keys";

const records = inject(recordsKey);
const attributes = inject(attributesKey);

// add 2 to the colspan for the # and actions columns
const colspan = computed(() => {
  if (attributes?.length) {
    return attributes?.length + 2;
  } else return null;
});
</script>

<style scoped></style>
