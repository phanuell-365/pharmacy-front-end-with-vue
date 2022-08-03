<template>
  <section>
    <div v-if="error.errorState">
      <FormPlaceholder />
    </div>
    <div v-else-if="isLoading">
      <FormPlaceholder />
    </div>
    <div v-else-if="!error.errorState">
      <DisabledForm :record="formattedOrder" />
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
import type { SupplierDto } from "@/interfaces/suppliers";
import type { DrugDto } from "@/interfaces/drugs";
import { useSuppliersStore } from "@/stores/app/suppliers";
import { useDrugsStore } from "@/stores/app/drugs";
import { useOrdersStore } from "@/stores/app/orders";
import type { OrdersDto } from "@/interfaces/orders";

const FormPlaceholder = defineAsyncComponent(
  () => import("@/components/form/placeholder/FormPlaceholder.vue")
);

const DisabledForm = defineAsyncComponent(
  () => import("@/components/form/disabled/DisabledForm.vue")
);

const router = useRouter();

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

const ordersStore = useOrdersStore();
const drugsStore = useDrugsStore();
const suppliersStore = useSuppliersStore();

interface ViewOrderProps {
  orderId: string;
}

const props = defineProps<ViewOrderProps>();

const order: Ref<OrdersDto | undefined> = ref();
const drug: Ref<DrugDto | undefined> = ref();
const supplier: Ref<SupplierDto | undefined> = ref();

const isLoading = ref(false);

const formattedOrder = reactive({
  id: "",
  orderQuantity: 0,
  status: "",
  Drug: "",
  Supplier: "",
});

const error = reactive({
  errorState: false,
  message: "",
});

onMounted(async () => {
  try {
    isLoading.value = true;
    order.value = await ordersStore.loadOrderById(props.orderId);
    drug.value = await drugsStore.loadDrugById(order.value?.DrugId);
    supplier.value = await suppliersStore.loadSupplierById(
      order.value?.SupplierId
    );

    formattedOrder.id = order.value?.id;
    formattedOrder.orderQuantity = order.value?.orderQuantity;
    formattedOrder.status = order.value?.status;
    formattedOrder.Drug = drug.value?.name;
    formattedOrder.Supplier = supplier.value?.name;

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
  if (props.orderId === "update") {
    return "/orders/update";
  }
  next();
});

const onCloseModal = () => {
  modalRef.value?.hide();
  router.back();
};
</script>

<style scoped></style>
