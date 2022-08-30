<template>
  <table class="table table-sm table-hover table-bordered border-light">
    <TableHead />
    <ClickableBody />
  </table>
</template>

<script lang="ts" setup>
import TableHead from "../TableHead.vue";
import { defineAsyncComponent, provide } from "vue";
import { attributesKey, recordsKey } from "@/keys";

const ClickableBody = defineAsyncComponent(
  () => import("../clickable/ClickableBody.vue")
);

interface TableProps {
  records: object;
  attributes: object;
}

const props = defineProps<TableProps>();

provide(recordsKey, props.records);
provide(attributesKey, props.attributes);
</script>

<style scoped></style>
