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
        <label class="form-label" for="validationSupplierId">Supplier</label>
        <select
          id="validationSupplierId"
          v-model.trim="SupplierId"
          class="form-select"
          name="SupplierId"
          required
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
          required
          type="number"
        />
        <div class="invalid-feedback">{{ orderQuantityInvalidFeedback }}</div>
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
import { useOrdersStore } from "@/stores/app/orders";
import { useDrugsStore } from "@/stores/app/drugs";
import { useSuppliersStore } from "@/stores/app/suppliers";
import type { DrugDto } from "@/interfaces/drugs";
import type { SupplierDto } from "@/interfaces/suppliers";
import type { NewOrderDto } from "@/interfaces/orders";
import { useGetFormElement } from "@/composables";

const FormButton = defineAsyncComponent(
  () => import("@/components/form/FormButton.vue")
);

const toastRefInfo = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefDanger = ref<InstanceType<typeof LiveToast> | null>(null);

const router = useRouter();

const ordersStore = useOrdersStore();
const drugsStore = useDrugsStore();
const suppliersStore = useSuppliersStore();

const drugs: Ref<DrugDto[]> = ref([]);
const suppliers: Ref<SupplierDto[]> = ref([]);

const error = reactive({
  errorState: false,
  message: "",
});

onMounted(async () => {
  try {
    drugs.value = await drugsStore.loadDrugs();
    suppliers.value = await suppliersStore.loadSuppliers();
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

// model
const DrugId: Ref<NewOrderDto["DrugId"] | undefined> = ref();
const SupplierId: Ref<NewOrderDto["SupplierId"] | undefined> = ref();
const orderQuantity: Ref<NewOrderDto["orderQuantity"] | undefined> = ref();

const orderQuantityInvalidFeedback = ref<string | undefined>(
  "" + "Please enter an order quantity"
);

// validity of the form inputs and select options
const validOrderObj = reactive({
  orderQuantity: false,
  DrugId: false,
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
};

const onFormSubmitHandler = async (event: Event) => {
  const form = event.target as HTMLFormElement;

  const payload: NewOrderDto = {
    orderQuantity: 0,
    DrugId: "",
    SupplierId: "",
  };

  validateForm(form);

  if (validOrderObj.orderQuantity) {
    payload.orderQuantity = orderQuantity.value as number;
  }

  if (validOrderObj.DrugId) {
    payload.DrugId = DrugId.value as string;
  }

  if (validOrderObj.SupplierId) {
    payload.SupplierId = SupplierId.value as string;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const values = Object.values(validOrderObj) as Array<boolean>;

  const isValid = values.every((value) => value);

  try {
    if (isValid) {
      const success = await ordersStore.createOrder({ ...payload });

      if (success) {
        toastRefInfo.value?.toastText("The order was created successfully!");
        toastRefInfo.value?.toastElapsedDuration("Just now");
        toastRefInfo.value?.toastHeading("Create Order");
        toastRefInfo.value?.toastName("create-order");
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
  router.push("/orders");
};
</script>

<style scoped></style>
