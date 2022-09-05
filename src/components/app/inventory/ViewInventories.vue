<template>
  <section>
    <div>
      <Teleport to="body">
        <SimpleModal ref="modalRef" danger static-backdrop>
          <template #buttons>
            <ModalButton
              color="info"
              text="Login"
              @click="onLoginClickButton"
            />
            <ModalButton color="danger" text="Cancel" @click="onCloseModal" />
          </template>
        </SimpleModal>
      </Teleport>
    </div>
    <div v-if="isLoading">
      <TablePlaceholders />
    </div>
    <div v-else-if="!error.errorState">
      <div v-if="clickable">
        <ClickableTable
          :attributes="inventoryAttributes"
          :records="convertedInventories"
        />
      </div>
      <div v-else>
        <TheTable
          :attributes="inventoryAttributes"
          :records="convertedInventories"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useMenuStore } from "@/stores/menu";
import type { Ref } from "vue";
import { defineAsyncComponent, onMounted, provide, reactive, ref } from "vue";
import TheTable from "@/components/table/TheTable.vue";
import SimpleModal from "@/components/modal/SimpleModal.vue";
import ModalButton from "@/components/modal/ModalButton.vue";
import {
  buttonEditIconKey,
  buttonNameKey,
  buttonViewIconKey,
  clickableKey,
  routeEndPointKey,
  routeStartPointKey,
} from "@/keys";
import { EDIT_ICON, INVENTORY_ICON } from "@/constants/icons";
import { useRouter } from "vue-router";
import { useInventoryStore } from "@/stores/app/inventory";
import type { InventoryDto } from "@/interfaces/inventory";
import { useConvertExpirationDate } from "@/composables/inventory";
import { useDrugsStore } from "@/stores/app/drugs";
import type { DrugDto } from "@/interfaces/drugs";

const TablePlaceholders = defineAsyncComponent(
  () => import("@/components/table/TablePlaceholders.vue")
);

const ClickableTable = defineAsyncComponent(
  () => import("@/components/table/clickable/ClickableTable.vue")
);

const router = useRouter();

const menuStore = useMenuStore();
const inventoryStore = useInventoryStore();
const drugsStore = useDrugsStore();

const activeMenu = menuStore.getActiveMenuName;

// provide icons and button name for the clickable table
// they're injected in the clickable table
provide(buttonNameKey, activeMenu);
provide(buttonEditIconKey, EDIT_ICON);
provide(buttonViewIconKey, INVENTORY_ICON);

interface ViewInventoryProps {
  clickable?: boolean;
  href?: string;
}

const props = defineProps<ViewInventoryProps>();
if (props.clickable) {
  provide(clickableKey, true);
  provide(routeStartPointKey, "inventory");
  provide(routeEndPointKey, props.href);
} else {
  provide(clickableKey, false);
}

const error = reactive({
  errorState: false,
  message: "",
});

const isLoading = ref(false);
const inventories: Ref<InventoryDto[]> = ref([]);
const drugs: Ref<DrugDto[]> = ref([]);
const convertedInventories: Ref<InventoryDto[]> = ref([]);
const inventoryAttributes: Ref<string[]> = ref([]);

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

onMounted(async () => {
  try {
    isLoading.value = true;
    inventories.value = await inventoryStore.loadInventories();
    drugs.value = await drugsStore.loadDrugs();
    convertedInventories.value = useConvertExpirationDate(inventories).value;
    inventoryAttributes.value = inventoryStore.getInventoryAttributes;

    isLoading.value = false;
  } catch (e: any) {
    error.errorState = true;

    error.message = e.message;
    console.error(e);

    if (error.message.includes("Unauthorized")) {
      modalRef.value?.modalText(
        "Have you just logged out? Login to continue ..."
      );
      modalRef.value?.modalTitle(error.message);
      modalRef.value?.show();
    }
  }
});

const onLoginClickButton = () => {
  modalRef.value?.hide();
  router.push("/login");
};

const onCloseModal = () => {
  modalRef.value?.hide();
};
</script>

<style scoped></style>
