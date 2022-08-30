<template>
  <th>#</th>
  <th v-for="fieldName in fieldNames" :key="fieldName" :scope="scope">
    {{ _.startCase(fieldName) }}
  </th>
  <th v-if="!clickable">Actions</th>
</template>

<script lang="ts" setup>
import _ from "lodash";
import { inject } from "vue";
import { clickableKey } from "@/keys";

interface HeaderProps {
  scope: string;
  fieldNames: object;
}

defineProps<HeaderProps>();

const clickable = inject(clickableKey);
</script>

<style scoped></style>
