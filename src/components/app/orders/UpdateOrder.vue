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

        <div class="col-md-4">
          <label class="form-label" for="validationSupplierId">Supplier</label>
          <select
            id="validationSupplierId"
            v-model.trim="SupplierId"
            class="form-select"
            name="SupplierId"
          >
            <option
              v-for="supplier in suppliers"
              :key="supplier.name"
              :value="supplier.id"
            >
              {{ _.startCase(supplier.name) }}
            </option>
          </select>
          <div class="invalid-feedback">Please select a supplier</div>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="validationOrderQuantity"
            >Order Quantity</label
          >
          <input
            id="validationOrderQuantity"
            v-model.trim="orderQuantity"
            class="form-control"
            name="orderQuantity"
            type="number"
          />
          <div class="invalid-feedback">{{ orderQuantityInvalidFeedback }}</div>
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
              v-for="_status in orderStatuses"
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
import _ from "lodash";
import { useRouter } from "vue-router";
import { useDrugsStore } from "@/stores/app/drugs";
import { useOrdersStore } from "@/stores/app/orders";
import { useSuppliersStore } from "@/stores/app/suppliers";
import type { DrugDto } from "@/interfaces/drugs";
import type { SupplierDto } from "@/interfaces/suppliers";
import type { UpdateOrderDto } from "@/interfaces/orders";
import { useGetFormElement } from "@/composables";

const FormPlaceholder = defineAsyncComponent(
  () => import("@/components/form/placeholder/FormPlaceholder.vue")
);

const FormButton = defineAsyncComponent(
  () => import("@/components/form/FormButton.vue")
);

const router = useRouter();

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

interface UpdateOrderProps {
  orderId: string;
}

const props = defineProps<UpdateOrderProps>();

const ordersStore = useOrdersStore();
const drugsStore = useDrugsStore();
const suppliersStore = useSuppliersStore();

const order: Ref<UpdateOrderDto> = ref({
  DrugId: "",
  SupplierId: "",
});
const drugs: Ref<DrugDto[]> = ref([]);
const suppliers: Ref<SupplierDto[]> = ref([]);
const orderStatuses: Ref<string[]> = ref([]);

const isLoading = ref(false);

const error = reactive({
  errorState: false,
  message: "",
});

const toastRefDanger = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefSuccess = ref<InstanceType<typeof LiveToast> | null>(null);

const DrugId: Ref<UpdateOrderDto["DrugId"] | undefined> = ref();
const SupplierId: Ref<UpdateOrderDto["SupplierId"] | undefined> = ref();
const orderQuantity: Ref<UpdateOrderDto["orderQuantity"] | undefined> = ref();
const status: Ref<UpdateOrderDto["status"] | undefined> = ref();

onMounted(async () => {
  try {
    order.value = await ordersStore.loadOrderById(props.orderId);
    drugs.value = await drugsStore.loadDrugs();
    suppliers.value = await suppliersStore.loadSuppliers();
    orderStatuses.value = await ordersStore.loadOrderStatuses();

    orderQuantity.value = order.value.orderQuantity;
    SupplierId.value = order.value.SupplierId;
    DrugId.value = order.value.DrugId;
    status.value = order.value.status;
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

const orderQuantityInvalidFeedback = ref<string | undefined>(
  "" + "Please enter an order quantity"
);

// validity of the form inputs and select options
const validOrderObj = reactive({
  orderQuantity: false,
  DrugId: false,
  status: false,
  SupplierId: false,
});

const validateForm = (form: HTMLFormElement) => {
  // the orderQuantity element
  const orderQuantityEl = useGetFormElement(form, "input", "orderQuantity")
    .value as HTMLInputElement;

  if (!orderQuantity.value) {
    orderQuantityEl.classList.add("is-invalid");
    validOrderObj.orderQuantity = false;
  } else if (orderQuantity.value && orderQuantity.value <= 1) {
    orderQuantityInvalidFeedback.value =
      "The order quantity may not be less than or equal to one";
    validOrderObj.orderQuantity = false;
  } else {
    orderQuantityEl.classList.remove("is-invalid");
    validOrderObj.orderQuantity = true;
  }

  // the DrugId element
  const DrugIdEl = useGetFormElement(form, "select", "DrugId")
    .value as HTMLSelectElement;

  if (!DrugId.value) {
    DrugIdEl.classList.add("is-invalid");
    validOrderObj.DrugId = false;
  } else {
    DrugIdEl.classList.remove("is-invalid");
    validOrderObj.DrugId = true;
  }

  // the SupplierId element
  const SupplierIdEl = useGetFormElement(form, "select", "SupplierId")
    .value as HTMLSelectElement;

  if (!SupplierId.value) {
    SupplierIdEl.classList.add("is-invalid");
    validOrderObj.SupplierId = false;
  } else {
    SupplierIdEl.classList.remove("is-invalid");
    validOrderObj.SupplierId = true;
  }

  // the status element
  const statusEl = useGetFormElement(form, "select", "status")
    .value as HTMLSelectElement;

  if (!status.value) {
    statusEl.classList.add("is-invalid");
    validOrderObj.status = false;
  } else {
    statusEl.classList.remove("is-invalid");
    validOrderObj.status = true;
  }
};

const onFormSubmitHandler = async (event: Event) => {
  const form = event.target as HTMLFormElement;

  const payload: UpdateOrderDto = {
    DrugId: "",
    SupplierId: "",
  };

  validateForm(form);

  if (validOrderObj.orderQuantity && orderQuantity.value) {
    payload.orderQuantity = orderQuantity.value as number;
  }

  if (validOrderObj.DrugId && DrugId.value) {
    payload.DrugId = DrugId.value as string;
  }

  if (validOrderObj.SupplierId && SupplierId.value) {
    payload.SupplierId = SupplierId.value as string;
  }

  if (validOrderObj.status && status.value) {
    payload.status = status.value as string;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const values = Object.values(validOrderObj) as Array<boolean>;

  const isValid = values.every((value) => value);

  try {
    if (isValid) {
      const success = await ordersStore.updateOrder(props.orderId, {
        ...payload,
      });

      if (success) {
        toastRefSuccess.value?.toastText("The order was updated successfully!");
        toastRefSuccess.value?.toastElapsedDuration("Just now");
        toastRefSuccess.value?.toastHeading("Create Order");
        toastRefSuccess.value?.toastName("update-order");
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
    toastRefDanger.value?.toastName("order-update-error");
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
  await router.push("/orders");
};
</script>

<style scoped></style>
