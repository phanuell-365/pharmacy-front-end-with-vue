<template>
  <section>
    <div v-if="error.errorState">
      <!--      <p class="display-5 text-danger">-->
      <!--        An Error Occurred. {{ error.message }}-->
      <!--      </p>-->
      <FormPlaceholder />
    </div>
    <div v-else-if="isLoading">
      <FormPlaceholder />
    </div>
    <div v-else-if="!error.errorState">
      <DisabledForm :record="supplier" />
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
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import SimpleModal from "@/components/modal/SimpleModal.vue";
import ModalButton from "@/components/modal/CloseButton.vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useSuppliersStore } from "@/stores/app/suppliers";

const FormPlaceholder = defineAsyncComponent(
  () => import("@/components/form/placeholder/FormPlaceholder.vue")
);

const DisabledForm = defineAsyncComponent(
  () => import("@/components/form/disabled/DisabledForm.vue")
);

const router = useRouter();

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

const suppliersStore = useSuppliersStore();

interface ViewSupplierProps {
  supplierId: string;
}

const props = defineProps<ViewSupplierProps>();

const supplier = ref({});
const isLoading = ref(false);

const error = reactive({
  errorState: false,
  message: "",
});

onMounted(async () => {
  try {
    isLoading.value = true;
    supplier.value = await suppliersStore.loadSupplierById(props.supplierId);
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
  if (props.supplierId === "update") {
    return "/suppliers/update";
  }
  next();
});

const onCloseModal = (clickedButton: string) => {
  modalRef.value?.hide();
  router.back();
};
</script>

<style scoped></style>
