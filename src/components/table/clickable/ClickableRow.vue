<template>
  <tr
    v-for="(record, index) in records"
    :key="record.id"
    @click="onClickHandler(record.id)"
  >
    <th scope="row">{{ index + 1 }}</th>
    <TableData :field-names="attributes" :record="record" />
  </tr>
</template>

<script lang="ts" setup>
import TableData from "../TableData.vue";
import { inject } from "vue";
import {
  attributesKey,
  recordsKey,
  routeEndPointKey,
  routeStartPointKey,
} from "@/keys";
import { useRouter } from "vue-router";

const router = useRouter();

const records = inject(recordsKey);
const attributes = inject(attributesKey);
const routeStartPoint = inject(routeStartPointKey);
const routeEndPoint = inject(routeEndPointKey);

const onClickHandler = (recordId: string) => {
  router.push(`/${routeStartPoint}/${recordId}/${routeEndPoint}`);
};
</script>
<style scoped></style>
