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
          :attributes="suppliersAttributes"
          :records="suppliers"
        />
      </div>
      <div v-else>
        <TheTable :attributes="suppliersAttributes" :records="suppliers" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import TheTable from "@/components/table/TheTable.vue";
import SimpleModal from "@/components/modal/SimpleModal.vue";
import ModalButton from "@/components/modal/ModalButton.vue";
import { useMenuStore } from "@/stores/menu";
import { useSuppliersStore } from "@/stores/app/suppliers";
import { useRouter } from "vue-router";
import { defineAsyncComponent, onMounted, provide, reactive, ref } from "vue";
import { EDIT_ICON, PATIENTS_ICON } from "@/constants/icons";
import {
  buttonEditIconKey,
  buttonNameKey,
  buttonViewIconKey,
  clickableKey,
  routeEndPointKey,
  routeStartPointKey,
} from "@/keys";

const TablePlaceholders = defineAsyncComponent(
  () => import("@/components/table/TablePlaceholders.vue")
);

const ClickableTable = defineAsyncComponent(
  () => import("@/components/table/clickable/ClickableTable.vue")
);

const router = useRouter();

const menuStore = useMenuStore();
const suppliersStore = useSuppliersStore();

const activeMenu = menuStore.getActiveMenuName;

// provide icons and button name for the clickable table
// they're injected in the clickable table
provide(buttonNameKey, activeMenu);
provide(buttonEditIconKey, EDIT_ICON);
provide(buttonViewIconKey, PATIENTS_ICON);

interface ViewSupplierProps {
  clickable?: boolean;
  href?: string;
}

const props = defineProps<ViewSupplierProps>();

if (props.clickable) {
  provide(clickableKey, true);
  provide(routeStartPointKey, "suppliers");
  provide(routeEndPointKey, props.href);
} else {
  provide(clickableKey, false);
}

const error = reactive({
  errorState: false,
  message: "",
});

const isLoading = ref(false);
const suppliers = ref({});
const suppliersAttributes = ref({});

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

onMounted(async () => {
  try {
    isLoading.value = true;
    suppliers.value = await suppliersStore.loadSuppliers();
    suppliersAttributes.value = suppliersStore.getSuppliersAttributes;
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
