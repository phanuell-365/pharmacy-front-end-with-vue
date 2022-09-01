<template>
  <section>
    <Teleport to="body">
      <SimpleModal ref="errorLoadingDrugRef" centered danger static-backdrop>
        <ModalButton color="danger" text="go back" @click="onCloseModal" />
      </SimpleModal>
    </Teleport>
    <div v-if="error.errorState">
      <FormPlaceholder />
    </div>
    <div v-else-if="isLoading">
      <FormPlaceholder />
    </div>
    <div v-else-if="!error.errorState">
      <form class="row g-3 m-4" novalidate @submit.prevent="onFormSubmit">
        <div class="col-md-4">
          <label class="form-label" for="validationName">Drug name</label>
          <input
            id="validationName"
            v-model.trim="name"
            class="form-control"
            name="name"
            type="text"
          />
          <div class="invalid-feedback">Please enter a drug name</div>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="validationDoseForm">Dose Form</label>
          <select
            id="validationDoseForm"
            v-model.trim="doseForm"
            class="form-select"
            name="doseForm"
          >
            <option
              v-for="_doseForm in drugDoseForms"
              :key="_doseForm"
              :value="_doseForm"
            >
              {{ _doseForm }}
            </option>
          </select>
          <div class="invalid-feedback">Please enter a dose form</div>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="validationStrength">Strength</label>
          <input
            id="validationStrength"
            v-model.trim="strength"
            class="form-control"
            name="strength"
            type="text"
          />
          <div class="invalid-feedback">{{ invalidDrugStrengthText }}</div>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="validationLevelOfUse"
            >Level Of Use</label
          >
          <input
            id="validationLevelOfUse"
            v-model.trim.number="levelOfUse"
            class="form-control"
            name="levelOfUse"
            type="number"
          />
          <div class="invalid-feedback">Please enter a level of use</div>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="validationTherapeuticClass"
            >Therapeutic Class</label
          >
          <input
            id="validationTherapeuticClass"
            v-model.trim="therapeuticClass"
            class="form-control"
            name="therapeuticClass"
            type="text"
          />
          <div class="invalid-feedback">Please enter a therapeutic class</div>
        </div>

        <FormButton name="Update" type="submit" />
      </form>
    </div>
    <Teleport to="body">
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
        <LiveToast ref="toastRefDoseFormDanger" skin="danger" />
        <LiveToast ref="toastRefStrengthDanger" skin="danger" />
        <LiveToast ref="toastRefCreateErrorDanger" skin="danger" />
        <LiveToast ref="toastRefLevelOfUseDanger" skin="danger" />
      </ToastContainer>
    </Teleport>
  </section>
</template>

<script lang="ts" setup>
import type { Ref } from "vue";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import LiveToast from "@/components/toast/LiveToast.vue";
import SimpleModal from "@/components/modal/SimpleModal.vue";
import ModalButton from "@/components/modal/ModalButton.vue";
import { useRouter } from "vue-router";
import { useDrugsStore } from "@/stores/app/drugs";
import type { UpdateDrugDto } from "@/interfaces/drugs";

const FormPlaceholder = defineAsyncComponent(
  () => import("@/components/form/placeholder/FormPlaceholder.vue")
);

const FormButton = defineAsyncComponent(
  () => import("@/components/form/FormButton.vue")
);

const errorLoadingDrugRef = ref<InstanceType<typeof SimpleModal> | null>(null);
const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

const router = useRouter();

const drugsStore = useDrugsStore();
const drugDoseForms: Ref<string[]> = ref([]);
const drugStrengths: Ref<string[]> = ref([]);

interface UpdateDrugProps {
  drugId: string;
}

const props = defineProps<UpdateDrugProps>();

const drug: Ref<UpdateDrugDto> = ref({});
const isLoading = ref(false);

const error = reactive({
  errorState: false,
  message: "",
});

const toastRefDanger = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefSuccess = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefDoseFormDanger = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefStrengthDanger = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefCreateErrorDanger = ref<InstanceType<typeof LiveToast> | null>(
  null
);
const toastRefLevelOfUseDanger = ref<InstanceType<typeof LiveToast> | null>(
  null
);

const name: Ref<UpdateDrugDto["name"] | undefined> = ref();
const doseForm: Ref<UpdateDrugDto["doseForm"] | undefined> = ref(
  drugDoseForms.value[0]
);
const strength: Ref<UpdateDrugDto["strength"] | undefined> = ref();
const levelOfUse: Ref<UpdateDrugDto["levelOfUse"] | undefined> = ref();
const therapeuticClass: Ref<UpdateDrugDto["therapeuticClass"] | undefined> =
  ref();

onMounted(async () => {
  try {
    drug.value = await drugsStore.loadDrugById(props.drugId);

    name.value = drug.value.name;
    doseForm.value = drug.value.doseForm;
    strength.value = drug.value.strength;
    levelOfUse.value = drug.value.levelOfUse;
    therapeuticClass.value = drug.value.therapeuticClass;

    drugDoseForms.value = await drugsStore.loadDrugDoseForms();
    drugStrengths.value = await drugsStore.loadDrugStrengths();
  } catch (e: any) {
    error.errorState = true;
    error.message = e.message;

    if (error.message.includes("Unauthorized")) {
      modalRef.value?.modalText(
        "Have you just logged out? Login to continue ..."
      );
      modalRef.value?.modalTitle(error.message);
      modalRef.value?.show();
      console.log(modalRef, error);
    } else if (error.message?.includes("dose forms")) {
      toastRefDoseFormDanger.value?.toastText(
        `An error occurred! ${error.message}`
      );
      toastRefDoseFormDanger.value?.toastElapsedDuration("Just now");
      toastRefDoseFormDanger.value?.toastHeading("Error");
      toastRefDoseFormDanger.value?.toastName("drug-dose-forms-error");
      toastRefDoseFormDanger.value?.show();
    } else if (error.message?.includes("strength")) {
      toastRefStrengthDanger.value?.toastText(
        `An error occurred! ${error.message}`
      );
      toastRefStrengthDanger.value?.toastElapsedDuration("Just now");
      toastRefStrengthDanger.value?.toastHeading("Error");
      toastRefStrengthDanger.value?.toastName("drug-strength-error");
      toastRefStrengthDanger.value?.show();
    } else if (!error.message.includes("Unauthorized")) {
      errorLoadingDrugRef.value?.modalText(error.message);
      errorLoadingDrugRef.value?.modalTitle("Error");
      errorLoadingDrugRef.value?.show();
      console.log(errorLoadingDrugRef);
    }
  }
});

const invalidDrugStrengthText = ref("Please enter a strength");

const onFormSubmit = async () => {
  const payload: UpdateDrugDto = {};

  if (name.value) payload.name = name.value;

  if (doseForm.value) payload.doseForm = doseForm.value;

  if (strength.value) payload.strength = strength.value;

  if (levelOfUse.value) payload.levelOfUse = levelOfUse.value;

  if (therapeuticClass.value) payload.therapeuticClass = therapeuticClass.value;

  try {
    const success = await drugsStore.updateDrug(props.drugId, payload);

    if (success) {
      toastRefSuccess.value?.toastText("The drug was updated successfully!");
      toastRefSuccess.value?.toastElapsedDuration("Just now");
      toastRefSuccess.value?.toastHeading("Drug update");
      toastRefSuccess.value?.toastName("drug-update");
      toastRefSuccess.value?.show();
    }
  } catch (error: any) {
    toastRefDanger.value?.toastText(`An error occurred! ${error.message}`);
    toastRefDanger.value?.toastElapsedDuration("Just now");
    toastRefDanger.value?.toastHeading("Error");
    toastRefDanger.value?.toastName("drug-update-error");
    toastRefDanger.value?.show();
  }
};

const onCloseModal = () => {
  errorLoadingDrugRef.value?.hide();
  router.back();
};

const onLoginClick = () => {
  modalRef.value?.hide();
  router.push("/login");
};

const onCloseClick = () => {
  modalRef.value?.hide();
};

const onHiddenBsToastHandlerSuccess = async () => {
  await router.push("/drugs");
};
</script>

<style scoped></style>
