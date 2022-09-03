<template>
  <section>
    <div v-if="error.errorState">
      <FormPlaceholder />
    </div>
    <div v-else-if="isLoading">
      <FormPlaceholder />
    </div>
    <div v-else-if="!error.errorState">
      <DisabledForm :record="formattedSupply" />
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
import { useSuppliesStore } from "@/stores/app/supplies";
import type { SupplyDto } from "@/interfaces/supplies";
import type { OrdersDto } from "@/interfaces/orders";
import type { DrugDto } from "@/interfaces/drugs";
import type { SupplierDto } from "@/interfaces/suppliers";
import { useOrdersStore } from "@/stores/app/orders";
import { useDrugsStore } from "@/stores/app/drugs";
import { useSuppliersStore } from "@/stores/app/suppliers";

const FormPlaceholder = defineAsyncComponent(
  () => import("@/components/form/placeholder/FormPlaceholder.vue")
);

const DisabledForm = defineAsyncComponent(
  () => import("@/components/form/disabled/DisabledForm.vue")
);

const router = useRouter();

const suppliesStore = useSuppliesStore();
const ordersStore = useOrdersStore();
const drugsStore = useDrugsStore();
const suppliersStore = useSuppliersStore();

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

interface ViewSupplyProps {
  supplyId: string;
}

const props = defineProps<ViewSupplyProps>();

const supply: Ref<SupplyDto | undefined> = ref();
const order: Ref<OrdersDto | undefined> = ref();
const drug: Ref<DrugDto | undefined> = ref();
const supplier: Ref<SupplierDto | undefined> = ref();

const isLoading = ref(false);

const formattedSupply = reactive({
  id: "",
  packSizeQuantity: 0,
  pricePerPackSize: 0,
  totalPackSizePrice: 0,
  Supplier: "",
  Drug: "",
});

const error = reactive({
  errorState: false,
  message: "",
});

onMounted(async () => {
  try {
    isLoading.value = true;

    supply.value = await suppliesStore.loadSupplyById(props.supplyId);
    order.value = await ordersStore.loadOrderById(supply.value?.OrderId);
    drug.value = await drugsStore.loadDrugById(order.value?.DrugId);
    supplier.value = await suppliersStore.loadSupplierById(
      order.value?.SupplierId
    );

    formattedSupply.id = supply.value?.id;
    formattedSupply.packSizeQuantity = supply.value?.packSizeQuantity;
    formattedSupply.pricePerPackSize = supply.value?.pricePerPackSize;
    formattedSupply.totalPackSizePrice = supply.value?.totalPackSizePrice;
    formattedSupply.Drug = drug.value?.name;
    formattedSupply.Supplier = supplier.value?.name;

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
  if (props.supplyId === "update") {
    return "/supplies/update";
  }
  next();
});

const onCloseModal = () => {
  modalRef.value?.hide();
  router.back();
};
</script>

<style scoped></style>
