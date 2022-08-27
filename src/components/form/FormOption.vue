<template>
  <div class="col-md-4">
    <label :for="`validation-${name}`" class="form-label">{{ label }}</label>
    <select
      :id="`validation-${name}`"
      v-model="bufferValue"
      :name="name"
      class="form-select"
      required
      @blur.once="onInputBlur"
    >
      <option disabled selected value="">Please select a role</option>
      <option v-for="option in options" :key="option" :value="option">
        {{ _.startCase(option) }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import _ from "lodash";
import { ref } from "vue";

interface OptionProps {
  label: string;
  name: string;
  options: string[];
  invalidFeedback: string;
}

const props = defineProps<OptionProps>();

const bufferValue = ref<null | string | number>(null);

const emits = defineEmits(["inputBlur"]);

const onInputBlur = () => {
  emits("inputBlur", {
    name: props.name,
    value: bufferValue,
  });
};
</script>

<style scoped></style>
