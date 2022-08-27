<template>
  <div class="col-md-4">
    <label :for="`validation-${name}`" class="form-label">{{ label }}</label>
    <input
      :id="`validation-${name}`"
      v-model="bufferValue"
      :type="type"
      class="form-control"
      required
      @blur.once="onInputBlur"
    />
    <div class="invalid-feedback">{{ invalidFeedback }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface InputProps {
  label: string;
  name: string;
  type: string;
  invalidFeedback: string;
}

const props = defineProps<InputProps>();

const bufferValue = ref<null | string | number>();

const emits = defineEmits(["inputBlur"]);

const onInputBlur = () => {
  emits("inputBlur", {
    name: props.name,
    value: bufferValue,
  });
};
</script>

<style scoped></style>
