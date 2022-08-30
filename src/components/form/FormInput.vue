<template>
  <div :class="col">
    <label :for="`validation-${name}`" class="form-label">{{ label }}</label>
    <input
      :id="`validation-${name}`"
      v-model="bufferValue"
      :name="name"
      :type="type"
      class="form-control class-input"
      required
      @blur="onInputBlur"
    />
    <div class="invalid-feedback">{{ invalidFeedback }}</div>
  </div>
</template>

<script lang="ts" setup>
import type { Ref } from "vue";
import { ref } from "vue";

interface InputProps {
  label: string;
  name: string;
  type: string;
  invalidFeedback: string;
  col: string;
  value?: string | null | number | object;
}

const props = defineProps<InputProps>();

const value = ref(props.value);

const bufferValue = ref<null | string | number | object>();

if (props.value) {
  bufferValue.value = value.value;
}

const emits = defineEmits(["inputBlur"]);

interface FormInputEmitType {
  name: string;
  value: Ref<null | string | number | undefined>;
}

const onInputBlur = () => {
  const emitValue: FormInputEmitType = {
    name: props.name,
    value: bufferValue,
  };
  emits("inputBlur", emitValue);
};
</script>

<style scoped></style>
