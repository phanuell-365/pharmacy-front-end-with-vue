<template>
  <section>
    <div
      ref="modalRef"
      :aria-labelledby="ariaLabelledBy"
      :data-bs-backdrop="backdrop"
      aria-hidden="true"
      class="modal fade"
      data-bs-keyboard="false"
      tabindex="-1"
    >
      <div :class="{ 'modal-dialog-centered': centered }" class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5
              :id="ariaLabelledBy"
              :class="{ 'text-danger': danger }"
              class="modal-title"
            >
              <FontAwesome :icon-name="iconName" class="mx-2" />
              {{ exposedProps.title }}
            </h5>
            <button
              aria-label="Close"
              class="btn-close"
              data-bs-dismiss="modal"
              type="button"
            ></button>
          </div>
          <div class="modal-body">
            <p class="fs-5">{{ exposedProps.text }}</p>
          </div>
          <div class="modal-footer">
            <slot name="buttons" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, reactive, ref } from "vue";
import * as bootstrap from "bootstrap";
import { DANGER_ICON, OK_ICON } from "@/constants/icons";

const FontAwesome = defineAsyncComponent(
  () => import("@/components/icons/FontAwesome.vue")
);

interface SimpleModalProps {
  staticBackdrop?: boolean;
  centered?: boolean;
  danger?: boolean;
}

const props = defineProps<SimpleModalProps>();

const iconName = computed(() => (props.danger ? DANGER_ICON : OK_ICON));

const emit = defineEmits(["on-hidden-bs-modal"]);

const exposedProps = reactive({
  title: String(),
  text: String(),
});

const backdrop = computed(() => (props.staticBackdrop ? "static" : "default"));

const ariaLabelledBy = computed(() => `${backdrop.value}BackdropLabel`);

const modalRef = ref<HTMLDivElement | null>(null);

const newModal = ref();

onMounted(() => {
  newModal.value = new bootstrap.Modal(modalRef.value as HTMLDivElement);
});

defineExpose({
  modalText: (prop: string) => (exposedProps.text = prop),
  modalTitle: (prop: string) => (exposedProps.title = prop),
  show: () => newModal.value.show(),
  hide: () => newModal.value.hide(),
});

onMounted(() => {
  modalRef.value?.addEventListener("hidden.bs.modal", () => {
    emit("on-hidden-bs-modal");
  });
});
</script>

<style scoped></style>
