<template>
  <section>
    <div v-if="error.errorState">
      <FormPlaceholder />
    </div>
    <div v-else-if="isLoading">
      <FormPlaceholder />
    </div>
    <div v-else-if="!error.errorState">
      <section>
        <form
          class="row g-3 m-4"
          novalidate
          @submit.prevent="onFormSubmitHandler"
        >
          <div class="col-md-4">
            <label class="form-label" for="validationDrug">Drug</label>
            <input
              id="validationDrug"
              :value="drugName"
              class="form-control bg-light shadow-sm border-success"
              disabled
              readonly
              type="text"
            />
          </div>

          <div class="col-md-4">
            <label class="form-label" for="validationSupplier">Supplier</label>
            <input
              id="validationSupplier"
              :value="supplierName"
              class="form-control bg-light shadow-sm border-success"
              disabled
              readonly
              type="text"
            />
          </div>

          <div class="col-md-4">
            <label class="form-label" for="validationOrderQuantity"
              >Order Quantity</label
            >
            <input
              id="validationOrderQuantity"
              :value="orderQuantity"
              class="form-control bg-light shadow-sm border-success"
              disabled
              readonly
              type="text"
            />
          </div>

          <div class="col-md-4">
            <label class="form-label" for="validationPackSizeQuantity"
              >Pack Size Quantity</label
            >
            <input
              id="validationPackSizeQuantity"
              v-model.trim="packSizeQuantity"
              class="form-control"
              name="packSizeQuantity"
              required
              type="number"
            />
            <div class="invalid-feedback">
              {{ packSizeQuantityInvalidFeedback }}
            </div>
          </div>

          <div class="col-md-4">
            <label class="form-label" for="validationPricePerPackSize"
              >Price Per Pack Size</label
            >
            <input
              id="validationPricePerPackSize"
              v-model.trim="pricePerPackSize"
              class="form-control"
              name="pricePerPackSize"
              required
              type="number"
            />
            <div class="invalid-feedback">
              {{ pricePerPackSizeInvalidFeedback }}
            </div>
          </div>

          <div class="col-md-4">
            <label class="form-label" for="validationTotalPackSizePrice"
              >Total Pack Size Price</label
            >
            <input
              id="validationTotalPackSizePrice"
              v-model.trim="totalPackSizePrice"
              class="form-control"
              name="totalPackSizePrice"
              required
              type="number"
            />
            <div class="invalid-feedback">
              {{ totalPackSizePriceInvalidFeedback }}
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
import type { Ref } from "vue";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import SimpleModal from "@/components/modal/SimpleModal.vue";
import ModalButton from "@/components/modal/CloseButton.vue";
import FormButton from "@/components/form/FormButton.vue";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import LiveToast from "@/components/toast/LiveToast.vue";
import { useRouter } from "vue-router";
import { useSuppliesStore } from "@/stores/app/supplies";
import { useOrdersStore } from "@/stores/app/orders";
import { useDrugsStore } from "@/stores/app/drugs";
import { useSuppliersStore } from "@/stores/app/suppliers";
import type { OrdersDto } from "@/interfaces/orders";
import type { DrugDto } from "@/interfaces/drugs";
import type { SupplierDto } from "@/interfaces/suppliers";
import type { NewSupplyDto } from "@/interfaces/supplies";
import { useGetFormElement } from "@/composables";

const FormPlaceholder = defineAsyncComponent(
  () => import("@/components/form/placeholder/FormPlaceholder.vue")
);

const router = useRouter();

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

const toastRefInfo = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefDanger = ref<InstanceType<typeof LiveToast> | null>(null);

interface CreateSupplyProps {
  orderId: string;
}

const props = defineProps<CreateSupplyProps>();

const suppliesStore = useSuppliesStore();
const ordersStore = useOrdersStore();
const drugsStore = useDrugsStore();
const suppliersStore = useSuppliersStore();

const isLoading = ref(false);

const order: Ref<OrdersDto | undefined> = ref();
const drug: Ref<DrugDto | undefined> = ref();
const supplier: Ref<SupplierDto | undefined> = ref();

const drugName: Ref<DrugDto["name"] | undefined> = ref();
const supplierName: Ref<SupplierDto["name"] | undefined> = ref();
const orderQuantity: Ref<OrdersDto["orderQuantity"] | undefined> = ref();

const packSizeQuantity: Ref<NewSupplyDto["packSizeQuantity"] | undefined> =
  ref();
const pricePerPackSize: Ref<NewSupplyDto["pricePerPackSize"] | undefined> =
  ref();
const totalPackSizePrice: Ref<NewSupplyDto["totalPackSizePrice"] | undefined> =
  ref();

const error = reactive({
  errorState: false,
  message: "",
});

onMounted(async () => {
  try {
    isLoading.value = true;

    order.value = await ordersStore.loadOrderById(props.orderId);
    drug.value = await drugsStore.loadDrugById(order.value?.DrugId);
    supplier.value = await suppliersStore.loadSupplierById(
      order.value?.SupplierId
    );
    drugName.value = drug.value?.name;
    supplierName.value = supplier.value?.name;
    orderQuantity.value = order.value?.orderQuantity;

    isLoading.value = false;
  } catch (e: any | undefined) {
    error.message = e.message;
    modalRef.value?.modalText(error.message);
    modalRef.value?.modalTitle("Error");
    modalRef.value?.show();
    console.error(e);
  }
});

const packSizeQuantityInvalidFeedback = ref<string | undefined>(
  "Please enter a pack size quantity"
);

const pricePerPackSizeInvalidFeedback = ref<string | undefined>(
  "Please enter the price per pack size"
);

const totalPackSizePriceInvalidFeedback = ref<string | undefined>(
  "Please enter the total pack size price"
);

const validSupplyObj = reactive({
  packSizeQuantity: false,
  pricePerPackSize: false,
  totalPackSizePrice: false,
});

const validateForm = (form: HTMLFormElement) => {
  // the packSizeQuantity element
  const packSizeQuantityEl = useGetFormElement(
    form,
    "input",
    "packSizeQuantity"
  ).value as HTMLInputElement;

  if (!packSizeQuantity.value) {
    packSizeQuantityEl.classList.add("is-invalid");
    validSupplyObj.packSizeQuantity = false;
  } else if (packSizeQuantity.value && packSizeQuantity.value <= 1) {
    packSizeQuantityEl.classList.add("is-invalid");
    packSizeQuantityInvalidFeedback.value =
      "The pack size quantity may not be less than or equal to one";
    validSupplyObj.packSizeQuantity = false;
  } else {
    packSizeQuantityEl.classList.remove("is-invalid");
    validSupplyObj.packSizeQuantity = true;
  }

  // the pricePerPackSize element
  const pricePerPackSizeEl = useGetFormElement(
    form,
    "input",
    "pricePerPackSize"
  ).value as HTMLInputElement;

  if (!pricePerPackSize.value) {
    pricePerPackSizeEl.classList.add("is-invalid");
    validSupplyObj.pricePerPackSize = false;
  } else if (pricePerPackSize.value && pricePerPackSize.value <= 1) {
    pricePerPackSizeInvalidFeedback.value =
      "The price per pack size may not be less than or equal to one";
    validSupplyObj.pricePerPackSize = false;
  } else {
    pricePerPackSizeEl.classList.remove("is-invalid");
    validSupplyObj.pricePerPackSize = true;
  }

  // the totalPackSizePrice element
  const totalPackSizePriceEl = useGetFormElement(
    form,
    "input",
    "totalPackSizePrice"
  ).value as HTMLInputElement;

  if (!totalPackSizePrice.value) {
    totalPackSizePriceEl.classList.add("is-invalid");
    validSupplyObj.totalPackSizePrice = false;
  } else if (totalPackSizePrice.value && totalPackSizePrice.value <= 1) {
    totalPackSizePriceEl.classList.add("is-invalid");
    totalPackSizePriceInvalidFeedback.value =
      "The total pack size price may not be less than or equal to one";
    validSupplyObj.totalPackSizePrice = false;
  } else {
    totalPackSizePriceEl.classList.remove("is-invalid");
    validSupplyObj.totalPackSizePrice = true;
  }
};

const onFormSubmitHandler = async (event: Event) => {
  const form = event.target as HTMLFormElement;

  const payload: NewSupplyDto = {
    packSizeQuantity: 0,
    pricePerPackSize: 0,
    totalPackSizePrice: 0,
    OrderId: props.orderId,
  };

  validateForm(form);

  if (validSupplyObj.packSizeQuantity)
    payload.packSizeQuantity = packSizeQuantity.value as number;

  if (validSupplyObj.pricePerPackSize)
    payload.pricePerPackSize = pricePerPackSize.value as number;

  if (validSupplyObj.totalPackSizePrice)
    payload.totalPackSizePrice = totalPackSizePrice.value as number;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const values = Object.values(validSupplyObj) as Array<boolean>;

  const isValid = values.every((value) => value);

  try {
    if (isValid) {
      const success = await suppliesStore.createSupply({ ...payload });

      if (success) {
        toastRefInfo.value?.toastText("The supply was created successfully!");
        toastRefInfo.value?.toastElapsedDuration("Just now");
        toastRefInfo.value?.toastHeading("Create Supply");
        toastRefInfo.value?.toastName("create-supply");
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
    toastRefDanger.value?.toastName("supply-create-error");
    toastRefDanger.value?.show();
  }
};

const onCloseModal = () => {
  modalRef.value?.hide();
  router.back();
};

const onHiddenBsToastHandlerInfo = () => {
  router.push("/supplies");
};
</script>

<style scoped></style>
