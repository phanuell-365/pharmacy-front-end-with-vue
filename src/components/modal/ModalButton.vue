<template>
  <button
    :class="{ [`btn-${color}`]: color }"
    class="btn btn-sm"
    type="button"
    @click="onClickHandler"
  >
    {{ text }}
  </button>
</template>

<script lang="ts" setup>
interface CloseButtonProps {
  color: string;
  text: string;
}

const props = defineProps<CloseButtonProps>();

const emit = defineEmits<{ (e: "onmodalclick", buttonName: string): void }>();

const onClickHandler = () => {
  emit("onmodalclick", props.text);
};
</script>

<style scoped></style>
