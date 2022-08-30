<template>
  <td v-for="fieldName in fieldNames" :key="fieldName">
    {{ record[fieldName] }}
  </td>
  <td class="text-center">
    <div v-if="!clickable" class="btn-group">
      <ButtonIcon
        :icon="editIcon"
        :name="name"
        :to="`/${name}/${record.id}/update`"
        color="primary"
        outline
        size="sm"
      />
      <ButtonIcon
        :icon="viewIcon"
        :name="name"
        :to="`/${name}/${record.id}/`"
        color="secondary"
        outline
        size="sm"
      />
    </div>
  </td>
</template>

<script lang="ts" setup>
import ButtonIcon from "@/components/Buttons/ButtonIcon.vue";
import { inject } from "vue";
import {
  buttonEditIconKey,
  buttonNameKey,
  buttonViewIconKey,
  clickableKey,
} from "@/keys";

interface DataProps {
  record: object;
  fieldNames: string[];
}

const name = inject(buttonNameKey);
const editIcon = inject(buttonEditIconKey);
const viewIcon = inject(buttonViewIconKey);
const clickable = inject(clickableKey);

defineProps<DataProps>();
</script>

<style scoped></style>
