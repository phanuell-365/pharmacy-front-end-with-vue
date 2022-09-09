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
        <ClickableTable :attributes="salesAttributes" :records="sales" />
      </div>
      <div v-else>
        <TheTable :attributes="salesAttributes" :records="sales" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useMenuStore } from "@/stores/menu";
import type { Ref } from "vue";
import { defineAsyncComponent, provide, reactive, ref } from "vue";
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
import { EDIT_SUPPLY_ICON, SALES_ICON } from "@/constants/icons";
import { useRouter } from "vue-router";
import { useSalesStore } from "@/stores/app/sales";
import type { SalesDto } from "@/interfaces/sales";

const TablePlaceholders = defineAsyncComponent(
  () => import("@/components/table/TablePlaceholders.vue")
);

const ClickableTable = defineAsyncComponent(
  () => import("@/components/table/clickable/ClickableTable.vue")
);

const router = useRouter();

const menuStore = useMenuStore();
const salesStore = useSalesStore();

const activeMenu = menuStore.getActiveMenuName;

// provide icons and button name for the clickable table
// they're injected in the clickable table
provide(buttonNameKey, activeMenu);
provide(buttonEditIconKey, EDIT_SUPPLY_ICON);
provide(buttonViewIconKey, SALES_ICON);

interface ViewSalesProps {
  clickable?: boolean;
  href?: string;
}

const props = defineProps<ViewSalesProps>();

if (props.clickable) {
  provide(clickableKey, true);
  provide(routeStartPointKey, "sales");
  provide(routeEndPointKey, props.href);
} else {
  provide(clickableKey, false);
}

const error = reactive({
  errorState: false,
  message: "",
});

const isLoading = ref(false);
const sales: Ref<SalesDto[]> = ref([]);
const salesAttributes: Ref<string[] | undefined> = ref([]);

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

try {
  isLoading.value = true;
  sales.value = await salesStore.loadSales();
  salesAttributes.value = salesStore.getSalesAttributes;
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

const onLoginClickButton = () => {
  modalRef.value?.hide();
  router.push("/login");
};

const onCloseModal = () => {
  modalRef.value?.hide();
};
</script>

<style scoped></style>
