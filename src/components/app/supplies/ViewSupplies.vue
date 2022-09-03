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
        <ClickableTable :attributes="suppliesAttributes" :records="supplies" />
      </div>
      <div v-else>
        <TheTable :attributes="suppliesAttributes" :records="supplies" />
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
import { EDIT_SUPPLY_ICON, SUPPLIES_ICON } from "@/constants/icons";
import { useRouter } from "vue-router";
import { useSuppliesStore } from "@/stores/app/supplies";
import type { SupplyDto } from "@/interfaces/supplies";

const TablePlaceholders = defineAsyncComponent(
  () => import("@/components/table/TablePlaceholders.vue")
);

const ClickableTable = defineAsyncComponent(
  () => import("@/components/table/clickable/ClickableTable.vue")
);

const router = useRouter();

const menuStore = useMenuStore();
const suppliesStore = useSuppliesStore();

const activeMenu = menuStore.getActiveMenuName;

// provide icons and button name for the clickable table
// they're injected in the clickable table
provide(buttonNameKey, activeMenu);
provide(buttonEditIconKey, EDIT_SUPPLY_ICON);
provide(buttonViewIconKey, SUPPLIES_ICON);

interface ViewSuppliesProps {
  clickable?: boolean;
  href?: string;
}

const props = defineProps<ViewSuppliesProps>();
if (props.clickable) {
  provide(clickableKey, true);
  provide(routeStartPointKey, "supplies");
  provide(routeEndPointKey, props.href);
} else {
  provide(clickableKey, false);
}

const error = reactive({
  errorState: false,
  message: "",
});

const isLoading = ref(false);
const supplies: Ref<SupplyDto[]> = ref([]);
const suppliesAttributes: Ref<string[] | undefined> = ref([]);

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

onMounted(async () => {
  try {
    isLoading.value = true;
    supplies.value = await suppliesStore.loadSupplies();
    suppliesAttributes.value = suppliesStore.getSuppliesAttributes;

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
