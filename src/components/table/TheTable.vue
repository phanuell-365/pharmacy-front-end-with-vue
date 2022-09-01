<template>
  <div class="scroll-table">
    <table class="table table-hover table-bordered border-light">
      <TableHead class="sticky-top" />
      <TableBody />
    </table>
  </div>
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

<style scoped>
.scroll-table {
  position: relative;
  height: 350px;
  overflow: auto;
  overflow-y: scroll;
}
</style>
