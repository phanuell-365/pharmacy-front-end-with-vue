<template>
  <section>
    <form class="row g-3 m-4" novalidate @submit.prevent="onFormSubmitHandler">
      <div class="col-md-4">
        <label class="form-label" for="validationIssueUnitPrice"
          >Issue Unit Price</label
        >
        <input
          id="validationIssueUnitPrice"
          v-model.trim.number="issueUnitPrice"
          class="form-control"
          name="issueUnitPrice"
          required
          type="number"
        />
        <div class="invalid-feedback">{{ issueUnitPriceInvalidFeedback }}</div>
      </div>

      <div class="col-md-4">
        <label class="form-label" for="validationIssueUnitPerPackSize"
          >Issue Unit Per Pack Size</label
        >
        <input
          id="validationIssueUnitPerPackSize"
          v-model.trim="issueUnitPerPackSize"
          class="form-control"
          name="issueUnitPerPackSize"
          required
          type="number"
        />
        <div class="invalid-feedback">
          {{ issueUnitPerPackSizeInvalidFeedback }}
        </div>
      </div>

      <div class="col-md-4">
        <label class="form-label" for="validationPackSize">Pack Size</label>
        <input
          id="validationPackSize"
          v-model.trim="packSize"
          class="form-control"
          name="packSize"
          required
          type="text"
        />
        <div class="invalid-feedback">{{ packSizeInvalidFeedback }}</div>
      </div>

      <div class="col-md-4">
        <label class="form-label" for="validationPackSizePrice"
          >Pack Size Price</label
        >
        <input
          id="validationPackSizePrice"
          v-model.trim="packSizePrice"
          class="form-control"
          name="packSizePrice"
          required
          type="number"
        />
        <div class="invalid-feedback">{{ packSizePriceInvalidFeedback }}</div>
      </div>

      <div class="col-md-4">
        <label class="form-label" for="validationExpirationDate"
          >Expiration Date</label
        >
        <input
          id="validationExpirationDate"
          v-model.trim="expirationDate"
          class="form-control"
          name="expirationDate"
          required
          type="date"
        />
        <div class="invalid-feedback">{{ expirationDateInvalidFeedback }}</div>
      </div>

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
import { useInventoryStore } from "@/stores/app/inventory";
import type { NewInventoryDto } from "@/interfaces/inventory";
import type { DrugDto } from "@/interfaces/drugs";
import { useDrugsStore } from "@/stores/app/drugs";
import { useGetFormElement } from "@/composables";

const FormButton = defineAsyncComponent(
  () => import("@/components/form/FormButton.vue")
);

const toastRefInfo = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefDanger = ref<InstanceType<typeof LiveToast> | null>(null);

const router = useRouter();

const inventoryStore = useInventoryStore();
const drugsStore = useDrugsStore();

const drugs: Ref<DrugDto[]> = ref([]);
const drugIssueUnits: Ref<string[]> = ref([]);

// validity of the form inputs and select options
const validInventoryObj = reactive({
  issueUnitPrice: false,
  issueUnitPerPackSize: false,
  packSize: false,
  packSizePrice: false,
  expirationDate: false,
  DrugId: false,
});

const error = reactive({
  errorState: false,
  message: "",
});

onMounted(async () => {
  try {
    drugIssueUnits.value = await inventoryStore.loadDrugIssueUnits();
    drugs.value = await drugsStore.loadDrugs();
  } catch (e: any) {
    error.errorState = true;
    error.message = e.message;
    toastRefDanger.value?.toastText(`An error occurred! ${error.message}`);
    toastRefDanger.value?.toastElapsedDuration("Just now");
    toastRefDanger.value?.toastHeading("Error");
    toastRefDanger.value?.toastName("inventory-issue-units-error");
    toastRefDanger.value?.show();
  }
});

const issueUnitPrice: Ref<NewInventoryDto["issueUnitPrice"] | undefined> =
  ref();
const issueUnitPerPackSize: Ref<
  NewInventoryDto["issueUnitPerPackSize"] | undefined
> = ref();
const packSize: Ref<NewInventoryDto["packSize"] | undefined> = ref();
const packSizePrice: Ref<NewInventoryDto["packSizePrice"] | undefined> = ref();
const expirationDate: Ref<NewInventoryDto["expirationDate"] | undefined> =
  ref();
const DrugId: Ref<NewInventoryDto["DrugId"] | undefined> = ref();

// invalid feedbacks declaration
const issueUnitPriceInvalidFeedback = ref<string | undefined>(
  "Please enter a valid issue unit price"
);
const issueUnitPerPackSizeInvalidFeedback = ref<string | undefined>(
  "Please enter a valid issue unit per pack size"
);
const packSizePriceInvalidFeedback = ref<string | undefined>(
  "Please enter a valid pack size price"
);

const packSizeInvalidFeedback = ref<string | undefined>(
  "Please enter an pack size"
);

const expirationDateInvalidFeedback = ref<string | undefined>(
  "Please enter an expiration date"
);

const validateForm = (form: HTMLFormElement) => {
  // the issue unit price element
  const issueUnitPriceEl = useGetFormElement(form, "input", "issueUnitPrice")
    .value as HTMLInputElement;

  if (!issueUnitPrice.value || issueUnitPrice.value <= 1) {
    issueUnitPriceEl.classList.add("is-invalid");
    validInventoryObj.issueUnitPrice = false;
  } else {
    issueUnitPriceEl.classList.remove("is-invalid");
    validInventoryObj.issueUnitPrice = true;
  }

  // the issue unit per pack size element
  const issueUnitPerPackSizeEl = useGetFormElement(
    form,
    "input",
    "issueUnitPerPackSize"
  ).value as HTMLInputElement;

  if (!issueUnitPerPackSize.value || issueUnitPerPackSize.value <= 1) {
    issueUnitPerPackSizeEl.classList.add("is-invalid");
    validInventoryObj.issueUnitPerPackSize = false;
  } else {
    issueUnitPerPackSizeEl.classList.remove("is-invalid");
    validInventoryObj.issueUnitPerPackSize = true;
  }

  // the pack size element
  const packSizeEl = useGetFormElement(form, "input", "packSize")
    .value as HTMLInputElement;

  if (!packSize.value || packSize.value?.length === 0) {
    packSizeEl.classList.add("is-invalid");
    validInventoryObj.packSize = false;
  } else if (!Number.isNaN(Number.parseInt(packSize.value))) {
    validInventoryObj.packSize = false;
    packSizeInvalidFeedback.value = "The pack size may not be a number";
    packSizeEl.classList.add("is-invalid");
  } else {
    packSizeEl.classList.remove("is-invalid");
    validInventoryObj.packSize = true;
  }

  // the pack size price element
  const packSizePriceEl = useGetFormElement(form, "input", "packSizePrice")
    .value as HTMLInputElement;

  if (!packSizePrice.value || packSizePrice.value <= 1) {
    validInventoryObj.packSizePrice = false;
    packSizePriceEl.classList.add("is-invalid");
  } else {
    packSizePriceEl.classList.remove("is-invalid");
    validInventoryObj.packSizePrice = true;
  }

  // the expiration date element
  const expirationDateEl = useGetFormElement(form, "input", "expirationDate")
    .value as HTMLInputElement;

  if (!expirationDate.value) {
    expirationDateEl.classList.add("is-invalid");
    validInventoryObj.expirationDate = false;
  } else if (new Date(expirationDate.value) <= new Date()) {
    expirationDateInvalidFeedback.value =
      "The expiration date may not be later than today!";
    validInventoryObj.expirationDate = false;
    expirationDateEl.classList.add("is-invalid");
  } else {
    expirationDateEl.classList.remove("is-invalid");
    validInventoryObj.expirationDate = true;
  }

  // the drug id element
  const DrugIdEl = useGetFormElement(form, "select", "DrugId")
    .value as HTMLSelectElement;

  if (!DrugId.value) {
    DrugIdEl.classList.add("is-invalid");
  } else {
    DrugIdEl.classList.remove("is-invalid");
    validInventoryObj.DrugId = true;
  }
};

const onFormSubmitHandler = async (event: Event) => {
  const form = event.target as HTMLFormElement;

  const payload: NewInventoryDto = {
    issueUnitPrice: 0,
    issueUnitPerPackSize: 0,
    packSize: "",
    packSizePrice: 0,
    expirationDate: "",
    DrugId: "",
  };

  validateForm(form);

  if (validInventoryObj.issueUnitPrice) {
    payload.issueUnitPrice = issueUnitPrice.value as number;
  }

  if (validInventoryObj.issueUnitPerPackSize) {
    payload.issueUnitPerPackSize = issueUnitPerPackSize.value as number;
  }

  if (validInventoryObj.packSize) {
    payload.packSize = packSize.value as string;
  }

  if (validInventoryObj.packSizePrice) {
    payload.packSizePrice = packSizePrice.value as number;
  }

  if (validInventoryObj.expirationDate) {
    payload.expirationDate = expirationDate.value as string;
  }

  if (validInventoryObj.DrugId) {
    payload.DrugId = DrugId.value as string;
  }

  console.log(payload);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const values = Object.values(validInventoryObj) as Array<boolean>;

  const isValid = values.every((value) => value);

  try {
    if (isValid) {
      const success = await inventoryStore.createInventory({ ...payload });

      if (success) {
        toastRefInfo.value?.toastText(
          "The inventory was created successfully!"
        );
        toastRefInfo.value?.toastElapsedDuration("Just now");
        toastRefInfo.value?.toastHeading("Create Inventory");
        toastRefInfo.value?.toastName("create-inventory");
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
    toastRefDanger.value?.toastName("drug-create-error");
    toastRefDanger.value?.show();
  }
};

const onHiddenBsToastHandlerInfo = () => {
  router.push("/inventory");
};
</script>

<style scoped></style>
