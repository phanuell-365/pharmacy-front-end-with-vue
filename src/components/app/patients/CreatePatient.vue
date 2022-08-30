<template>
  <section>
    <form class="row g-3 m-4" novalidate @submit.prevent="onFormSubmitHandler">
      <div class="col-md-4">
        <label class="form-label" for="validationName">Name</label>
        <input
          id="validationName"
          v-model.trim="name"
          class="form-control"
          name="name"
          required
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
          required
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
          required
          type="tel"
        />
        <div class="invalid-feedback">Please enter a phone</div>
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
import FormButton from "@/components/form/FormButton.vue";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import LiveToast from "@/components/toast/LiveToast.vue";
import type { Ref } from "vue";
import { ref } from "vue";
import type { NewPatientDto } from "@/interfaces/patients";
import { useRouter } from "vue-router";
import { useGetFormElement } from "@/composables";
import { usePatientsStore } from "@/stores/app/patients";

const router = useRouter();

const patientsStore = usePatientsStore();

const toastRefInfo = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefDanger = ref<InstanceType<typeof LiveToast> | null>(null);

const name: Ref<NewPatientDto["name"] | undefined> = ref();
const email: Ref<NewPatientDto["email"] | undefined> = ref();
const phone: Ref<NewPatientDto["phone"] | undefined> = ref();

const onFormSubmitHandler = async (event: Event) => {
  const form = event.target as HTMLFormElement;

  const payload: NewPatientDto = {
    name: "",
    email: "",
    phone: "",
  };

  (() => {
    const nameEl = useGetFormElement(form, "input", "name")
      .value as HTMLInputElement;

    if (!name?.value) {
      nameEl.classList.add("is-invalid");
    } else {
      nameEl.classList.remove("is-invalid");
      payload.name = name.value;
    }

    const emailEl = useGetFormElement(form, "input", "email")
      .value as HTMLInputElement;

    if (!email.value) {
      emailEl.classList.add("is-invalid");
    } else {
      emailEl.classList.remove("is-invalid");
      payload.email = email.value as string;
    }

    const phoneEl = useGetFormElement(form, "input", "phone")
      .value as HTMLInputElement;

    if (!phone.value) {
      phoneEl.classList.add("is-invalid");
    } else {
      phoneEl.classList.remove("is-invalid");
      payload.phone = phone.value as string;
    }
  })();

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const values = Object.values(payload);

    const valid = values.every((value: string) => value !== "");

    if (valid) {
      const success = await patientsStore.createPatient({
        ...payload,
      });

      if (success) {
        toastRefInfo.value?.toastText("The patient was created successfully!");
        toastRefInfo.value?.toastElapsedDuration("Just now");
        toastRefInfo.value?.toastHeading("Create Patients");
        toastRefInfo.value?.toastName("create-patient");
        toastRefInfo.value?.show();
      }
    }
  } catch (e: any) {
    toastRefDanger.value?.toastText(`An error occurred! ${e.message}`);
    toastRefDanger.value?.toastElapsedDuration("Just now");
    toastRefDanger.value?.toastHeading("Error");
    toastRefDanger.value?.toastName("patient-create-error");
    toastRefDanger.value?.show();
  }
};

const onHiddenBsToastHandlerInfo = () => {
  router.push("/patients");
};
</script>

<style scoped></style>
