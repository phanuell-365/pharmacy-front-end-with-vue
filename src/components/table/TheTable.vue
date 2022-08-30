<template>
  <table class="table table-sm table-hover table-bordered border-light">
    <TableHead />
    <TableBody />
  </table>
</template>

<script lang="ts" setup>
import TableHead from "./TableHead.vue";
import TableBody from "./TableBody.vue";
import { provide } from "vue";
import { attributesKey, recordsKey } from "@/keys";

interface TableProps {
  records: object;
  attributes: object;
}

const props = defineProps<TableProps>();

provide(recordsKey, props.records);
provide(attributesKey, props.attributes);
</script>

<style scoped></style>
