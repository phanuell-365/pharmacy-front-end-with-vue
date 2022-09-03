<template>
  <section>
    <div v-if="error.errorState">
      <FormPlaceholder />
    </div>
    <div v-else-if="isLoading">
      <FormPlaceholder />
    </div>
    <div v-else-if="!error.errorState">
      <DisabledForm :record="inventory" />
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
import { useInventoryStore } from "@/stores/app/inventory";
import { useDrugsStore } from "@/stores/app/drugs";
import type { InventoryDto } from "@/interfaces/inventory";
import type { DrugDto } from "@/interfaces/drugs";

const FormPlaceholder = defineAsyncComponent(
  () => import("@/components/form/placeholder/FormPlaceholder.vue")
);

const DisabledForm = defineAsyncComponent(
  () => import("@/components/form/disabled/DisabledForm.vue")
);

const router = useRouter();

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);
const inventoryStore = useInventoryStore();
const drugsStore = useDrugsStore();

interface ViewInventoryProps {
  inventoryId: string;
}

const props = defineProps<ViewInventoryProps>();

const inventory: Ref<InventoryDto | undefined> = ref();
const drug: Ref<DrugDto | undefined> = ref();
const isLoading = ref(false);

const formattedInventory = reactive({
  issueUnitPrice: 0,
  issueUnitPerPackSize: 0,
  packSize: "",
  packSizePrice: 0,
  expirationDate: "",
  Drug: "",
});

const error = reactive({
  errorState: false,
  message: "",
});

onMounted(async () => {
  try {
    isLoading.value = true;
    inventory.value = await inventoryStore.loadInventoryById(props.inventoryId);
    drug.value = await drugsStore.loadDrugById(inventory.value?.DrugId);
    formattedInventory.issueUnitPrice = inventory.value?.issueUnitPrice;
    formattedInventory.issueUnitPerPackSize =
      inventory.value?.issueUnitPerPackSize;
    formattedInventory.packSize = inventory.value?.packSize;
    formattedInventory.packSizePrice = inventory.value?.packSizePrice;
    formattedInventory.expirationDate = new Date(
      inventory.value?.expirationDate
    ).toLocaleDateString();
    formattedInventory.Drug = drug.value?.name;
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
  if (props.inventoryId === "update") {
    return "/inventory/update";
  }
  next();
});

const onCloseModal = () => {
  modalRef.value?.hide();
  router.back();
};
</script>

<style scoped></style>
