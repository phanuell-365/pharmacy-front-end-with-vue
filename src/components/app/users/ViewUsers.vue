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
        <ClickableTable :attributes="usersAttributes" :records="users" />
      </div>
      <div v-else>
        <TheTable :attributes="usersAttributes" :records="users" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useUsersStore } from "@/stores/app/users";
import { useMenuStore } from "@/stores/menu";
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
} from "@/keys";
import { EDIT_ICON, USERS_ICON } from "@/constants/icons";
import { useRouter } from "vue-router";

const TablePlaceholders = defineAsyncComponent(
  () => import("@/components/table/TablePlaceholders.vue")
);

const ClickableTable = defineAsyncComponent(
  () => import("@/components/table/clickable/ClickableTable.vue")
);

const router = useRouter();

const menuStore = useMenuStore();
const usersStore = useUsersStore();

const activeMenu = menuStore.getActiveMenuName;

// provide icons and button name for the clickable table
// they're injected in the clickable table
provide(buttonNameKey, activeMenu);
provide(buttonEditIconKey, EDIT_ICON);
provide(buttonViewIconKey, USERS_ICON);

interface ViewUsersProps {
  clickable?: boolean;
  href?: string;
}

const props = defineProps<ViewUsersProps>();
if (props.clickable) {
  provide(clickableKey, true);
  provide(routeEndPointKey, props.href);
} else {
  provide(clickableKey, false);
}

console.log("The props are -> ", props);

const error = reactive({
  errorState: false,
  message: "",
});

const isLoading = ref(false);
const users = ref({});
const usersAttributes = ref({});

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

onMounted(async () => {
  try {
    isLoading.value = true;
    users.value = await usersStore.loadUsers();
    usersAttributes.value = usersStore.getUsersAttributes;
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
