<template>
  <section>
    <!--    <Teleport to="body">-->
    <SimpleModal ref="errorLoadingUserRef" centered danger static-backdrop>
      <ModalButton color="danger" text="go back" @click="onCloseModal" />
    </SimpleModal>
    <!--    </Teleport>-->
    <div v-if="error.errorState">
      <FormPlaceholder />
    </div>
    <div v-else-if="isLoading">
      <FormPlaceholder />
    </div>
    <div v-else-if="!error.errorState">
      <form class="row g-3 m-4" novalidate @submit.prevent="onFormSubmit">
        <div class="col-md-4">
          <label class="form-label" for="validationName">Name</label>
          <input
            id="validationName"
            v-model.trim="name"
            class="form-control"
            name="name"
            type="text"
          />
          <div class="invalid-feedback">Please enter a name</div>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="validationEmail">Email</label>

          <input
            id="validationEmail"
            v-model.trim="email"
            class="form-control"
            name="email"
            type="email"
          />
          <div class="invalid-feedback">Please enter a email</div>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="validationEmail">Phone</label>
          <input
            id="validationPhone"
            v-model.trim="phone"
            class="form-control"
            name="phone"
            type="tel"
          />
          <div class="invalid-feedback">Please enter a phone</div>
        </div>

        <FormButton name="Create" type="submit" />
      </form>
    </div>
    <!--    <Teleport to="body">-->
    <SimpleModal ref="modalRef" danger static-backdrop>
      <template #buttons>
        <ModalButton color="info" text="login" @click="onLoginClick" />
        <ModalButton color="danger" text="cancel" @click="onCloseClick" />
      </template>
    </SimpleModal>
    <ToastContainer>
      <LiveToast ref="toastRefDanger" skin="danger" />
      <LiveToast
        ref="toastRefSuccess"
        skin="success"
        @on-hidden-bs-toast="onHiddenBsToastHandlerSuccess"
      />
    </ToastContainer>
    <!--    </Teleport>-->
  </section>
</template>

<script lang="ts" setup>
import FormButton from "@/components/form/FormButton.vue";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import LiveToast from "@/components/toast/LiveToast.vue";
import SimpleModal from "@/components/modal/SimpleModal.vue";
import ModalButton from "@/components/modal/ModalButton.vue";
import { useRouter } from "vue-router";
import type { Ref } from "vue";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import type { UpdatePatientDto } from "@/interfaces/patients";
import { usePatientsStore } from "@/stores/app/patients";

const FormPlaceholder = defineAsyncComponent(
  () => import("@/components/form/placeholder/FormPlaceholder.vue")
);

const patientsStore = usePatientsStore();

const errorLoadingUserRef = ref<InstanceType<typeof SimpleModal> | null>(null);

const router = useRouter();

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

interface UpdatePatientProps {
  patientId: string;
}

const props = defineProps<UpdatePatientProps>();

const patient: Ref<UpdatePatientDto> = ref({});
const isLoading = ref(false);

const error = reactive({
  errorState: false,
  message: "",
});

const name: Ref<UpdatePatientDto["name"]> = ref();
const email: Ref<UpdatePatientDto["email"]> = ref();
const phone: Ref<UpdatePatientDto["phone"]> = ref();

onMounted(async () => {
  try {
    isLoading.value = true;

    patient.value = await patientsStore.loadPatientById(props.patientId);

    name.value = patient.value.name;
    email.value = patient.value.email;
    phone.value = patient.value.phone;

    isLoading.value = false;
  } catch (e: any) {
    error.errorState = true;
    error.message = e.message;

    if (error.message.includes("Unauthorized")) {
      modalRef.value?.modalText(
        "Have you just logged out? Login to continue ..."
      );
      modalRef.value?.modalTitle(error.message);
      modalRef.value?.show();
    } else if (!error.message.includes("Unauthorized")) {
      errorLoadingUserRef.value?.modalText(error.message);
      errorLoadingUserRef.value?.modalTitle("Error");
      errorLoadingUserRef.value?.show();
      console.log(errorLoadingUserRef);
    }
  }
});

const onCloseModal = () => {
  errorLoadingUserRef.value?.hide();
  router.back();
};

const onLoginClick = () => {
  modalRef.value?.hide();
  router.push("/login");
};

const onCloseClick = () => {
  modalRef.value?.hide();
};

const toastRefDanger = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefSuccess = ref<InstanceType<typeof LiveToast> | null>(null);

const onFormSubmit = async () => {
  const payload: UpdatePatientDto = {};

  if (name.value) {
    payload.name = name.value;
  }

  if (email.value) {
    payload.email = email.value;
  }

  if (phone.value) {
    payload.phone = phone.value;
  }

  try {
    const success = await patientsStore.updatePatient(props.patientId, payload);
    if (success) {
      toastRefSuccess.value?.toastText("The patient was updated successfully!");
      toastRefSuccess.value?.toastElapsedDuration("Just now");
      toastRefSuccess.value?.toastHeading("Patient update");
      toastRefSuccess.value?.toastName("patient-update");
      toastRefSuccess.value?.show();
    }
  } catch (error: any) {
    toastRefDanger.value?.toastText(`An error occurred! ${error.message}`);
    toastRefDanger.value?.toastElapsedDuration("Just now");
    toastRefDanger.value?.toastHeading("Error");
    toastRefDanger.value?.toastName("patient-update-error");
    toastRefDanger.value?.show();
  }
};

const onHiddenBsToastHandlerSuccess = async () => {
  await router.push({ name: "view-patients" });
};
</script>

<style scoped></style>
