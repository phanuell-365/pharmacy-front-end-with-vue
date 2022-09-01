<template>
  <section>
    <form class="row g-3 m-4" novalidate @submit.prevent="onFormSubmitHandler">
      <div class="col-md-4">
        <label class="form-label" for="validationName">Drug name</label>
        <input
          id="validationName"
          v-model.trim="name"
          class="form-control"
          name="name"
          required
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
          required
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
          required
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
          required
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
          required
          type="text"
        />
        <div class="invalid-feedback">Please enter a therapeutic class</div>
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
        <LiveToast ref="toastRefDoseFormDanger" skin="danger" />
        <LiveToast ref="toastRefStrengthDanger" skin="danger" />
        <LiveToast ref="toastRefCreateErrorDanger" skin="danger" />
        <LiveToast ref="toastRefLevelOfUseDanger" skin="danger" />
      </ToastContainer>
    </Teleport>
  </section>
</template>

<script lang="ts" setup>
import ToastContainer from "@/components/toast/ToastContainer.vue";
import LiveToast from "@/components/toast/LiveToast.vue";
import type { Ref } from "vue";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useDrugsStore } from "@/stores/app/drugs";
import type { NewDrugDto } from "@/interfaces/drugs";
import { useArrayToString, useGetFormElement } from "@/composables";
import _ from "lodash";

const FormButton = defineAsyncComponent(
  () => import("@/components/form/FormButton.vue")
);

const toastRefInfo = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefDoseFormDanger = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefStrengthDanger = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefCreateErrorDanger = ref<InstanceType<typeof LiveToast> | null>(
  null
);
const toastRefLevelOfUseDanger = ref<InstanceType<typeof LiveToast> | null>(
  null
);

const router = useRouter();

const drugsStore = useDrugsStore();
const drugDoseForms: Ref<string[]> = ref([]);
const drugStrengths: Ref<string[]> = ref([]);

const error = reactive({
  errorState: false,
  message: "",
});

onMounted(async () => {
  try {
    drugDoseForms.value = await drugsStore.loadDrugDoseForms();
    drugStrengths.value = await drugsStore.loadDrugStrengths();
  } catch (e: any) {
    error.errorState = true;
    error.message = e.message;

    if (error.message?.includes("dose forms")) {
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
    }
  }
});

const name: Ref<NewDrugDto["name"] | undefined> = ref();
const doseForm: Ref<NewDrugDto["doseForm"] | undefined> = ref(
  drugDoseForms.value[0]
);
const strength: Ref<NewDrugDto["strength"] | undefined> = ref();
const levelOfUse: Ref<NewDrugDto["levelOfUse"] | undefined> = ref();
const therapeuticClass: Ref<NewDrugDto["therapeuticClass"] | undefined> = ref();

// drug strength invalid
const invalidDrugStrengthText = ref("Please enter a strength");

const onFormSubmitHandler = async (event: Event) => {
  const form = event.target as HTMLFormElement;

  const payload: NewDrugDto = {
    name: "",
    doseForm: "",
    strength: "",
    therapeuticClass: "",
    levelOfUse: 0,
  };

  (() => {
    const nameEl = useGetFormElement(form, "input", "name")
      .value as HTMLInputElement;

    if (!name.value) {
      nameEl.classList.add("is-invalid");
    } else {
      nameEl.classList.remove("is-invalid");
      payload.name = _.startCase(name.value?.toLowerCase());
    }

    const doseFormEl = useGetFormElement(form, "select", "doseForm")
      .value as HTMLSelectElement;

    if (!doseForm.value) {
      doseFormEl.classList.add("is-invalid");
    } else {
      doseFormEl.classList.remove("is-invalid");
      payload.doseForm = doseForm.value;
    }

    const strengthEl = useGetFormElement(form, "input", "strength")
      .value as HTMLInputElement;

    if (!strength.value) {
      strengthEl.classList.add("is-invalid");
    } else if (
      !(() =>
        drugStrengths.value.some((value) =>
          String(strength.value).includes(value)
        ))()
    ) {
      toastRefStrengthDanger.value?.toastText(
        `Invalid drug strength. May contain ${
          useArrayToString(drugStrengths.value).value
        }`
      );
      toastRefStrengthDanger.value?.toastElapsedDuration("Just now");
      toastRefStrengthDanger.value?.toastHeading(
        "Error! Invalid drug strength"
      );
      toastRefStrengthDanger.value?.toastName("drug-strength-error");
      toastRefStrengthDanger.value?.show();

      invalidDrugStrengthText.value = `Invalid drug strength. May contain ${
        useArrayToString(drugStrengths.value).value
      }`;
      strengthEl.classList.add("is-invalid");
      // payload.strength = "";
    } else {
      strengthEl.classList.remove("is-invalid");
      payload.strength = strength.value?.replace(";", "/");
    }

    const levelOfUseEl = useGetFormElement(form, "input", "levelOfUse")
      .value as HTMLInputElement;

    if (!levelOfUse.value) {
      levelOfUseEl.classList.add("is-invalid");
    } else if (levelOfUse.value <= 0) {
      levelOfUseEl.classList.add("is-invalid");

      toastRefLevelOfUseDanger.value?.toastText(
        "Error! The level of use may not be less than 1!"
      );
      toastRefLevelOfUseDanger.value?.toastElapsedDuration("Just now");
      toastRefLevelOfUseDanger.value?.toastHeading(
        "Error! Invalid level of use"
      );
      toastRefLevelOfUseDanger.value?.toastName("drug-strength-error");
      toastRefLevelOfUseDanger.value?.toastDelay(2000);
      toastRefLevelOfUseDanger.value?.show();
    } else {
      levelOfUseEl.classList.remove("is-invalid");
      payload.levelOfUse = levelOfUse.value;
    }

    const therapeuticClassEl = useGetFormElement(
      form,
      "input",
      "therapeuticClass"
    ).value as HTMLInputElement;

    if (!therapeuticClass.value) {
      therapeuticClassEl.classList.add("is-invalid");
    } else {
      therapeuticClassEl.classList.remove("is-invalid");
      payload.therapeuticClass = _.startCase(
        therapeuticClass.value?.toLowerCase()
      );
      console.log(payload.therapeuticClass);
    }
  })();

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const values = Object.values(payload);

    const valid = values.every((value: string) => value !== "");

    if (valid) {
      const success = await drugsStore.createDrug({ ...payload });

      if (success) {
        toastRefInfo.value?.toastText("The drug was created successfully!");
        toastRefInfo.value?.toastElapsedDuration("Just now");
        toastRefInfo.value?.toastHeading("Create Drugs");
        toastRefInfo.value?.toastName("create-drug");
        toastRefInfo.value?.show();
      }
    }
  } catch (e: any) {
    console.error(e);
    error.errorState = true;
    error.message = e.message;
    toastRefCreateErrorDanger.value?.toastText(
      `An error occurred! ${error.message}`
    );
    toastRefCreateErrorDanger.value?.toastElapsedDuration("Just now");
    toastRefCreateErrorDanger.value?.toastHeading("Error");
    toastRefCreateErrorDanger.value?.toastName("drug-create-error");
    toastRefCreateErrorDanger.value?.show();
  }
};

const onHiddenBsToastHandlerInfo = () => {
  router.push("/drugs");
};
</script>

<style scoped></style>
