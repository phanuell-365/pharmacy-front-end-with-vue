<template>
  <section>
    <form class="row g-3 m-4" novalidate @submit.prevent="onFormSubmitHandler">
      <div class="col-md-4">
        <label class="form-label" for="validationDrugId">Drug</label>
        <select
          id="validationDrugId"
          v-model.trim="DrugId"
          class="form-select"
          name="DrugId"
          required
        >
          <option v-for="drug in drugs" :key="drug.name" :value="drug.id">
            {{ _.startCase(drug.name) }}
          </option>
        </select>
        <div class="invalid-feedback">Please select a drug</div>
      </div>

      <div class="col-md-4">
        <label class="form-label" for="validationPatientId">Patient </label>
        <select
          id="validationPatientId"
          v-model.trim="PatientId"
          class="form-select"
          name="PatientId"
          required
        >
          <option
            v-for="patient in patients"
            :key="patient.name"
            :value="patient.id"
          >
            {{ _.startCase(patient.name) }}
          </option>
        </select>
        <div class="invalid-feedback">Please select a patient</div>
      </div>

      <div class="col-md-4">
        <label class="form-label" for="validationIssueUnitQuantity"
          >Issue Unit Quantity</label
        >
        <input
          id="validationIssueUnitQuantity"
          v-model.trim="issueUnitQuantity"
          class="form-control"
          name="issueUnitQuantity"
          required
          type="number"
        />
        <div class="invalid-feedback">
          {{ issueUnitQuantityInvalidFeedback }}
        </div>
      </div>

      <FormButton name="Create" type="submit" />
    </form>
    <Teleport to="body">
      <ToastContainer>
        <LiveToast
          ref="toastRefInfo"
          skin="info"
          @on-hidden-bs-toast="onHiddenBsToastHandlerInfo"
        />
        <LiveToast ref="toastRefDanger" skin="danger" />
      </ToastContainer>
    </Teleport>
  </section>
</template>

<script lang="ts" setup>
import _ from "lodash";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import LiveToast from "@/components/toast/LiveToast.vue";
import type { Ref } from "vue";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useGetFormElement } from "@/composables";
import { useSalesStore } from "@/stores/app/sales";
import { useDrugsStore } from "@/stores/app/drugs";
import { usePatientsStore } from "@/stores/app/patients";
import type { DrugDto } from "@/interfaces/drugs";
import type { PatientDto } from "@/interfaces/patients";
import type { NewSaleDto } from "@/interfaces/sales";

const FormButton = defineAsyncComponent(
  () => import("@/components/form/FormButton.vue")
);

const toastRefInfo = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefDanger = ref<InstanceType<typeof LiveToast> | null>(null);

const router = useRouter();

const salesStore = useSalesStore();
const drugsStore = useDrugsStore();
const patientsStore = usePatientsStore();

const drugs: Ref<DrugDto[]> = ref([]);
const patients: Ref<PatientDto[]> = ref([]);

const error = reactive({
  errorState: false,
  message: "",
});

onMounted(async () => {
  try {
    drugs.value = await drugsStore.loadDrugs();
    patients.value = await patientsStore.loadPatients();
  } catch (e: any) {
    error.errorState = true;
    error.message = e.message;
    toastRefDanger.value?.toastText(`An error occurred! ${error.message}`);
    toastRefDanger.value?.toastElapsedDuration("Just now");
    toastRefDanger.value?.toastHeading("Error");
    toastRefDanger.value?.toastName("orders-error");
    toastRefDanger.value?.show();
  }
});

const PatientId: Ref<NewSaleDto["PatientId"] | undefined> = ref();
const DrugId: Ref<NewSaleDto["DrugId"] | undefined> = ref();
const issueUnitQuantity: Ref<NewSaleDto["issueUnitQuantity"] | undefined> =
  ref();

const issueUnitQuantityInvalidFeedback = ref<string | undefined>(
  "Please enter an issue unit quantity"
);

const validSaleObj = reactive({
  issueUnitQuantity: false,
  DrugId: false,
  PatientId: false,
});

const validateForm = (form: HTMLFormElement) => {
  // the issueUnitQuantity element
  const issueUnitQuantityEl = useGetFormElement(
    form,
    "input",
    "issueUnitQuantity"
  ).value as HTMLInputElement;

  if (!issueUnitQuantity.value) {
    issueUnitQuantityEl.classList.add("is-invalid");
    validSaleObj.issueUnitQuantity = false;
  } else if (issueUnitQuantity.value && issueUnitQuantity.value <= 1) {
    issueUnitQuantityEl.classList.add("is-invalid");
    issueUnitQuantityInvalidFeedback.value =
      "The issue unit quantity may not be less than or equal to one";
    validSaleObj.issueUnitQuantity = false;
  } else {
    issueUnitQuantityEl.classList.remove("is-invalid");
    validSaleObj.issueUnitQuantity = true;
  }

  // the DrugId element
  const DrugIdEl = useGetFormElement(form, "select", "DrugId")
    .value as HTMLSelectElement;

  if (!DrugId.value) {
    DrugIdEl.classList.add("is-invalid");
    validSaleObj.DrugId = false;
  } else {
    DrugIdEl.classList.remove("is-invalid");
    validSaleObj.DrugId = true;
  }

  // the PatientIdEl element
  const PatientIdEl = useGetFormElement(form, "select", "PatientId")
    .value as HTMLSelectElement;

  if (!PatientId.value) {
    PatientIdEl.classList.add("is-invalid");
    validSaleObj.PatientId = false;
  } else {
    PatientIdEl.classList.remove("is-invalid");
    validSaleObj.PatientId = true;
  }
};

const onFormSubmitHandler = async (event: Event) => {
  const form = event.target as HTMLFormElement;

  const payload: NewSaleDto = {
    issueUnitQuantity: 0,
    DrugId: "",
    PatientId: "",
  };

  validateForm(form);

  if (validSaleObj.issueUnitQuantity) {
    payload.issueUnitQuantity = issueUnitQuantity.value as number;
  }

  if (validSaleObj.DrugId) {
    payload.DrugId = DrugId.value as string;
  }

  if (validSaleObj.PatientId) {
    payload.PatientId = PatientId.value as string;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const values = Object.values(validSaleObj) as Array<boolean>;

  const isValid = values.every((value) => value);

  try {
    if (isValid) {
      const success = await salesStore.createSale({ ...payload });

      if (success) {
        toastRefInfo.value?.toastText("The sale was created successfully!");
        toastRefInfo.value?.toastElapsedDuration("Just now");
        toastRefInfo.value?.toastHeading("Create Sale");
        toastRefInfo.value?.toastName("create-sales");
        toastRefInfo.value?.show();
      }
    }
  } catch (e: any) {
    console.error(e);
    error.errorState = true;
    error.message = e.message;
    toastRefDanger.value?.toastText(`An error occurred! ${error.message}`);
    toastRefDanger.value?.toastElapsedDuration("Just now");
    toastRefDanger.value?.toastHeading("Error");
    toastRefDanger.value?.toastName("order-create-error");
    toastRefDanger.value?.show();
  }
};

const onHiddenBsToastHandlerInfo = () => {
  router.push("/sales");
};
</script>

<style scoped></style>
