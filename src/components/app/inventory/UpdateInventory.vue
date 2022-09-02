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
      <form
        class="row g-3 m-4"
        novalidate
        @submit.prevent="onFormSubmitHandler"
      >
        <div class="col-md-4">
          <label class="form-label" for="validationIssueUnitPrice"
            >Issue Unit Price</label
          >
          <input
            id="validationIssueUnitPrice"
            v-model.trim.number="issueUnitPrice"
            class="form-control"
            name="issueUnitPrice"
            type="number"
          />
          <div class="invalid-feedback">
            {{ issueUnitPriceInvalidFeedback }}
          </div>
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
            type="text"
          />
          <div class="invalid-feedback">
            {{ expirationDateInvalidFeedback }}
          </div>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="validationDrugId">Drug</label>
          <select
            id="validationDrugId"
            v-model.trim="DrugId"
            class="form-select"
            name="DrugId"
          >
            <option v-for="drug in drugs" :key="drug.name" :value="drug.id">
              {{ _.startCase(drug.name) }}
            </option>
          </select>
          <div class="invalid-feedback">Please select a drug</div>
        </div>

        <FormButton name="update" type="submit" />
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
import { useInventoryStore } from "@/stores/app/inventory";
import { useRouter } from "vue-router";
import type { UpdateInventoryDto } from "@/interfaces/inventory";
import { useDrugsStore } from "@/stores/app/drugs";
import type { DrugDto } from "@/interfaces/drugs";
import _ from "lodash";
import { useGetFormElement } from "@/composables";

const FormPlaceholder = defineAsyncComponent(
  () => import("@/components/form/placeholder/FormPlaceholder.vue")
);

const FormButton = defineAsyncComponent(
  () => import("@/components/form/FormButton.vue")
);

const router = useRouter();

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

interface UpdateInventoryProps {
  inventoryId: string;
}

const props = defineProps<UpdateInventoryProps>();

const inventoryStore = useInventoryStore();
const drugsStore = useDrugsStore();

const inventory: Ref<UpdateInventoryDto> = ref({});
const drugs: Ref<DrugDto[]> = ref([]);

const isLoading = ref(false);

const error = reactive({
  errorState: false,
  message: "",
});

const toastRefDanger = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefSuccess = ref<InstanceType<typeof LiveToast> | null>(null);

const issueUnitPrice: Ref<UpdateInventoryDto["issueUnitPrice"] | undefined> =
  ref();
const issueUnitPerPackSize: Ref<
  UpdateInventoryDto["issueUnitPerPackSize"] | undefined
> = ref();
const packSize: Ref<UpdateInventoryDto["packSize"] | undefined> = ref();
const packSizePrice: Ref<UpdateInventoryDto["packSizePrice"] | undefined> =
  ref();
const expirationDate: Ref<UpdateInventoryDto["expirationDate"] | undefined> =
  ref();
const DrugId: Ref<UpdateInventoryDto["DrugId"] | undefined> = ref();

onMounted(async () => {
  try {
    inventory.value = await inventoryStore.loadInventoryById(props.inventoryId);
    drugs.value = await drugsStore.loadDrugs();

    issueUnitPrice.value = inventory.value.issueUnitPrice;
    issueUnitPerPackSize.value = inventory.value.issueUnitPerPackSize;
    packSize.value = inventory.value.packSize;
    packSizePrice.value = inventory.value.packSizePrice;
    expirationDate.value = new Date(
      inventory.value.expirationDate as string
    ).toLocaleDateString();
    DrugId.value = inventory.value.DrugId;
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

// validity of the form inputs and select options
const validInventoryObj = reactive({
  issueUnitPrice: false,
  issueUnitPerPackSize: false,
  packSize: false,
  packSizePrice: false,
  expirationDate: false,
  DrugId: false,
});

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

  const payload: UpdateInventoryDto = {};

  validateForm(form);

  if (validInventoryObj.issueUnitPrice && issueUnitPrice.value) {
    payload.issueUnitPrice = issueUnitPrice.value as number;
  }

  if (validInventoryObj.issueUnitPerPackSize && issueUnitPerPackSize.value) {
    payload.issueUnitPerPackSize = issueUnitPerPackSize.value as number;
  }

  if (validInventoryObj.packSize && packSize.value) {
    payload.packSize = packSize.value as string;
  }

  if (validInventoryObj.packSizePrice && packSizePrice.value) {
    payload.packSizePrice = packSizePrice.value as number;
  }

  if (validInventoryObj.expirationDate && expirationDate.value) {
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
      const success = await inventoryStore.updateInventory(props.inventoryId, {
        ...payload,
      });

      if (success) {
        toastRefSuccess.value?.toastText(
          "The inventory was updated successfully!"
        );
        toastRefSuccess.value?.toastElapsedDuration("Just now");
        toastRefSuccess.value?.toastHeading("inventory update");
        toastRefSuccess.value?.toastName("inventory-update");
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
    toastRefDanger.value?.toastName("drug-create-error");
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
  await router.push("/inventory");
};
</script>

<style scoped></style>
