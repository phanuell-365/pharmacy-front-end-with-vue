<template>
  <form class="row g-3 needs-validation m-4">
    <div v-for="key in Object.keys(record)" :key="key" class="col-md-4">
      <label :for="`validation-${key}`" class="form-label">{{
        _.startCase(key)
      }}</label>
      <input
        :id="`validation-${key}`"
        :value="record[key]"
        class="form-control bg-light shadow-sm border-success"
        disabled
        readonly
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import _ from "lodash";

interface DisableFormProps {
  record: object;
}

defineProps<DisableFormProps>();
</script>

<style scoped></style>
