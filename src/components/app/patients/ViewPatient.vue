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
      <DisabledForm :record="patient" />
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
import { usePatientsStore } from "@/stores/app/patients";

const FormPlaceholder = defineAsyncComponent(
  () => import("@/components/form/placeholder/FormPlaceholder.vue")
);

const DisabledForm = defineAsyncComponent(
  () => import("@/components/form/disabled/DisabledForm.vue")
);

const router = useRouter();

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

const patientsStore = usePatientsStore();

interface ViewPatientProps {
  patientId: string;
}

const props = defineProps<ViewPatientProps>();

const patient = ref({});
const isLoading = ref(false);

const error = reactive({
  errorState: false,
  message: "",
});

onMounted(async () => {
  try {
    isLoading.value = true;
    patient.value = await patientsStore.loadPatientById(props.patientId);
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
  if (props.patientId === "update") {
    return "/patients/update";
  }
  next();
});

const onCloseModal = (clickedButton: string) => {
  modalRef.value?.hide();
  router.back();
};
</script>

<style scoped></style>
