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
import { attributesKey, recordsKey, routeEndPointKey } from "@/keys";
import { useRouter } from "vue-router";

const router = useRouter();

const records = inject(recordsKey);
const attributes = inject(attributesKey);
const routeEndPoint = inject(routeEndPointKey);

const onClickHandler = (recordId: string) => {
  router.push(`/users/${recordId}/${routeEndPoint}`);
};
</script>
<style scoped></style>
