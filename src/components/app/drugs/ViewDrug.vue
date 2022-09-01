<template>
  <section>
    <div v-if="error.errorState">
      <FormPlaceholder />
    </div>
    <div v-else-if="isLoading">
      <FormPlaceholder />
    </div>
    <div v-else-if="!error.errorState">
      <DisabledForm :record="drug" />
    </div>
    <Teleport to="body">
      <SimpleModal ref="modalRef" danger static-backdrop>
        <template #buttons>
          <ModalButton color="danger" text="go back" @click="onCloseModal" />
        </template>
      </SimpleModal>
    </Teleport>
  </section>
</template>

<script lang="ts" setup>
import type { Ref } from "vue";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import SimpleModal from "@/components/modal/SimpleModal.vue";
import ModalButton from "@/components/modal/CloseButton.vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useDrugsStore } from "@/stores/app/drugs";
import type { DrugDto } from "@/interfaces/drugs";

const FormPlaceholder = defineAsyncComponent(
  () => import("@/components/form/placeholder/FormPlaceholder.vue")
);

const DisabledForm = defineAsyncComponent(
  () => import("@/components/form/disabled/DisabledForm.vue")
);

const router = useRouter();

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

const drugsStore = useDrugsStore();

interface ViewDrugProps {
  drugId: string;
}

const props = defineProps<ViewDrugProps>();

const drug: Ref<DrugDto | undefined> = ref(undefined);

const isLoading = ref(false);

const error = reactive({
  errorState: false,
  message: "",
});

onMounted(async () => {
  try {
    isLoading.value = true;
    drug.value = await drugsStore.loadDrugById(props.drugId);
    isLoading.value = false;
  } catch (e: any) {
    error.errorState = true;
    error.message = e.message;
    modalRef.value?.modalText(error.message);
    modalRef.value?.modalTitle("Error");
    modalRef.value?.show();
    console.error(e);
  }
});

onBeforeRouteLeave((to, from, next) => {
  if (props.drugId === "update") {
    return "/drugs/update";
  }
  next();
});

const onCloseModal = () => {
  modalRef.value?.hide();
  router.back();
};
</script>

<style scoped></style>
