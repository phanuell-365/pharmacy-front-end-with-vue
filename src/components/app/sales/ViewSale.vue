<template>
  <section>
    <div v-if="error.errorState">
      <FormPlaceholder />
    </div>
    <div v-else-if="isLoading">
      <FormPlaceholder />
    </div>
    <div v-else-if="!error.errorState">
      <DisabledForm :record="formattedSale" />
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
import { useSalesStore } from "@/stores/app/sales";
import { useDrugsStore } from "@/stores/app/drugs";
import { usePatientsStore } from "@/stores/app/patients";
import type { SalesDto } from "@/interfaces/sales";
import type { PatientDto } from "@/interfaces/patients";
import type { DrugDto } from "@/interfaces/drugs";

const FormPlaceholder = defineAsyncComponent(
  () => import("@/components/form/placeholder/FormPlaceholder.vue")
);

const DisabledForm = defineAsyncComponent(
  () => import("@/components/form/disabled/DisabledForm.vue")
);

const router = useRouter();

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

const salesStore = useSalesStore();
const drugsStore = useDrugsStore();
const patientsStore = usePatientsStore();

interface ViewSaleProps {
  saleId: string;
}

const props = defineProps<ViewSaleProps>();

const sale: Ref<SalesDto | undefined> = ref();
const drug: Ref<DrugDto | undefined> = ref();
const patient: Ref<PatientDto | undefined> = ref();

const isLoading = ref(false);

const formattedSale = reactive({
  id: "",
  issueUnitQuantity: 0,
  issueUnitPrice: 0,
  totalPrice: 0,
  status: "",
  Drug: "",
  Patient: "",
});

const error = reactive({
  errorState: false,
  message: "",
});

onMounted(async () => {
  try {
    isLoading.value = true;
    sale.value = await salesStore.loadSaleById(props.saleId);
    drug.value = await drugsStore.loadDrugById(sale.value?.DrugId);
    patient.value = await patientsStore.loadPatientById(sale.value?.PatientId);

    formattedSale.id = sale.value?.id;
    formattedSale.issueUnitQuantity = sale.value?.issueUnitQuantity;
    formattedSale.issueUnitPrice = sale.value?.issueUnitPrice;
    formattedSale.totalPrice = sale.value?.totalPrice;
    formattedSale.status = sale.value?.status;
    formattedSale.Drug = drug.value?.name;
    formattedSale.Patient = patient.value?.name;

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
  if (props.saleId === "update") {
    return "/sales/update";
  }
  next();
});

const onCloseModal = () => {
  modalRef.value?.hide();
  router.back();
};
</script>

<style scoped></style>
