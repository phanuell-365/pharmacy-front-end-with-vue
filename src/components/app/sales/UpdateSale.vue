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

      <div class="col-md-4">
        <label class="form-label" for="validationStatus">Status</label>
        <select
          id="validationStatus"
          v-model.trim="status"
          class="form-select"
          name="status"
        >
          <option
            v-for="_status in salesStatuses"
            :key="_status"
            :value="_status"
          >
            {{ _.startCase(_status) }}
          </option>
        </select>
        <div class="invalid-feedback">Please select a _status</div>
      </div>

      <FormButton name="update" type="submit" />
    </form>
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
      </ToastContainer>
    </Teleport>
  </section>
</template>

<script lang="ts" setup>
import _ from "lodash";
import type { Ref } from "vue";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import LiveToast from "@/components/toast/LiveToast.vue";
import SimpleModal from "@/components/modal/SimpleModal.vue";
import ModalButton from "@/components/modal/ModalButton.vue";
import { useRouter } from "vue-router";
import { useDrugsStore } from "@/stores/app/drugs";
import { usePatientsStore } from "@/stores/app/patients";
import { useSalesStore } from "@/stores/app/sales";
import type { UpdateSaleDto } from "@/interfaces/sales";
import type { DrugDto } from "@/interfaces/drugs";
import type { PatientDto } from "@/interfaces/patients";
import { useGetFormElement } from "@/composables";

const FormButton = defineAsyncComponent(
  () => import("@/components/form/FormButton.vue")
);

const router = useRouter();

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

interface UpdateSaleProps {
  salesId: string;
}

const props = defineProps<UpdateSaleProps>();

const salesStore = useSalesStore();
const drugsStore = useDrugsStore();
const patientsStore = usePatientsStore();

const sale: Ref<UpdateSaleDto> = ref({
  PatientId: "",
  DrugId: "",
});
const drugs: Ref<DrugDto[]> = ref([]);
const patients: Ref<PatientDto[]> = ref([]);
const salesStatuses: Ref<string[]> = ref([]);

const error = reactive({
  errorState: false,
  message: "",
});

const toastRefDanger = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefSuccess = ref<InstanceType<typeof LiveToast> | null>(null);

const PatientId: Ref<UpdateSaleDto["PatientId"] | undefined> = ref();
const DrugId: Ref<UpdateSaleDto["DrugId"] | undefined> = ref();
const issueUnitQuantity: Ref<UpdateSaleDto["issueUnitQuantity"] | undefined> =
  ref();
const status: Ref<UpdateSaleDto["status"] | undefined> = ref();

onMounted(async () => {
  try {
    sale.value = await salesStore.loadSaleById(props.salesId);
    drugs.value = await drugsStore.loadDrugs();
    patients.value = await patientsStore.loadPatients();
    salesStatuses.value = await salesStore.loadSalesStatuses();

    issueUnitQuantity.value = sale.value.issueUnitQuantity;
    PatientId.value = sale.value.PatientId;
    DrugId.value = sale.value.DrugId;
    status.value = sale.value.status;
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
    }
  }
});

const issueUnitQuantityInvalidFeedback = ref<string | undefined>(
  "Please enter an issue unit quantity"
);

const validSaleObj = reactive({
  issueUnitQuantity: false,
  status: false,
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

  // the status element
  const statusEl = useGetFormElement(form, "select", "status")
    .value as HTMLSelectElement;

  if (!status.value) {
    statusEl.classList.add("is-invalid");
    validSaleObj.status = false;
  } else {
    statusEl.classList.remove("is-invalid");
    validSaleObj.status = true;
  }
};

const onFormSubmitHandler = async (event: Event) => {
  const form = event.target as HTMLFormElement;

  const payload: UpdateSaleDto = {
    DrugId: "",
    PatientId: "",
  };

  validateForm(form);

  if (validSaleObj.issueUnitQuantity && issueUnitQuantity.value) {
    payload.issueUnitQuantity = issueUnitQuantity.value as number;
  }

  if (validSaleObj.DrugId) {
    payload.DrugId = DrugId.value as string;
  }

  if (validSaleObj.PatientId) {
    payload.PatientId = PatientId.value as string;
  }

  if (validSaleObj.status) {
    payload.status = status.value;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const values = Object.values(validSaleObj) as Array<boolean>;

  const isValid = values.every((value) => value);

  try {
    if (isValid) {
      const success = await salesStore.updateSale(props.salesId, {
        ...payload,
      });

      if (success) {
        toastRefSuccess.value?.toastText("The sale was updated successfully!");
        toastRefSuccess.value?.toastElapsedDuration("Just now");
        toastRefSuccess.value?.toastHeading("Update Sale");
        toastRefSuccess.value?.toastName("update-sales");
        toastRefSuccess.value?.show();
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

const onLoginClick = () => {
  modalRef.value?.hide();
  router.push("/login");
};

const onCloseClick = () => {
  modalRef.value?.hide();
};

const onHiddenBsToastHandlerSuccess = async () => {
  await router.push("/sales");
};
</script>

<style scoped></style>
