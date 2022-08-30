<template>
  <section>
    <form class="row g-3 m-4" novalidate @submit.prevent="onFormSubmitHandler">
      <div class="col-md-4">
        <label class="form-label" for="validationUsername">Username</label>
        <input
          id="validationUsername"
          v-model.trim="username"
          class="form-control"
          name="username"
          required
          type="text"
        />
        <div class="invalid-feedback">Please enter a username</div>
      </div>

      <div class="col-md-4">
        <label class="form-label" for="validationPassword">Password</label>

        <input
          id="validationPassword"
          v-model.trim="password"
          class="form-control"
          name="password"
          required
          type="password"
        />
        <div class="invalid-feedback">Please enter a password</div>
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
        <label class="form-label" for="validationRole">Role</label>
        <select
          id="validationRole"
          v-model.trim="role"
          class="form-select"
          name="role"
          required
        >
          <option disabled selected value="">Please select a role</option>
          <option v-for="_role in usersRoles" :key="_role" :value="_role">
            {{ _.startCase(_role) }}
          </option>
        </select>
      </div>

      <div class="col-md-4">
        <label class="form-label" for="validationPhone">Phone</label>
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
import _ from "lodash";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import LiveToast from "@/components/toast/LiveToast.vue";
import type { Ref } from "vue";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { useUsersStore } from "@/stores/app/users";
import { useRouter } from "vue-router";
import type { NewUserDto } from "@/interfaces";
import { useGetFormElement } from "@/composables";

const FormButton = defineAsyncComponent(
  () => import("@/components/form/FormButton.vue")
);

const toastRefInfo = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefDanger = ref<InstanceType<typeof LiveToast> | null>(null);

const router = useRouter();

const usersStore = useUsersStore();

const usersRoles = ref({});

const error = reactive({
  errorState: false,
  message: "",
});

onMounted(async () => {
  try {
    usersRoles.value = await usersStore.loadUsersRoles();
  } catch (e: any) {
    error.errorState = true;
    error.message = e.message;
    toastRefDanger.value?.toastText(`An error occurred! ${error.message}`);
    toastRefDanger.value?.toastElapsedDuration("Just now");
    toastRefDanger.value?.toastHeading("Error");
    toastRefDanger.value?.toastName("user-roles-error");
    toastRefDanger.value?.show();
  }
});

const username: Ref<NewUserDto["username"] | undefined> = ref();
const password: Ref<NewUserDto["password"] | undefined> = ref();
const email: Ref<NewUserDto["email"] | undefined> = ref();
const phone: Ref<NewUserDto["phone"] | undefined> = ref();
const role: Ref<NewUserDto["role"] | undefined> = ref();

const onFormSubmitHandler = async (event: Event) => {
  const form = event.target as HTMLFormElement;

  const payload: NewUserDto = {
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "",
  };

  (() => {
    const usernameEl = useGetFormElement(form, "input", "username")
      .value as HTMLInputElement;

    if (!username.value) {
      usernameEl.classList.add("is-invalid");
    } else {
      usernameEl.classList.remove("is-invalid");
      payload.username = username.value;
    }

    const passwordEl = useGetFormElement(form, "input", "password")
      .value as HTMLInputElement;

    if (!password.value) {
      passwordEl.classList.add("is-invalid");
    } else {
      passwordEl.classList.remove("is-invalid");
      payload.password = password.value;
    }

    const emailEl = useGetFormElement(form, "input", "email")
      .value as HTMLInputElement;

    if (!email.value) {
      emailEl.classList.add("is-invalid");
    } else {
      emailEl.classList.remove("is-invalid");
      payload.email = email.value as string;
    }

    const roleEl = useGetFormElement(form, "select", "role")
      .value as HTMLSelectElement;

    if (!role.value) {
      roleEl.classList.add("is-invalid");
    } else {
      roleEl.classList.remove("is-invalid");
      payload.role = role.value as string;
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
      // const success = await usersStore.createUser({
      //   username: payload.username as string,
      //   password: payload.password as string,
      //   email: payload.email as string,
      //   phone: payload.phone as string,
      //   role: payload.role as string,
      // });
      const success = await usersStore.createUser({ ...payload });

      if (success) {
        toastRefInfo.value?.toastText("The user was created successfully!");
        toastRefInfo.value?.toastElapsedDuration("Just now");
        toastRefInfo.value?.toastHeading("Create Users");
        toastRefInfo.value?.toastName("create-user");
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
    toastRefDanger.value?.toastName("user-create-error");
    toastRefDanger.value?.show();
  }
};

const onHiddenBsToastHandlerInfo = () => {
  router.push("/users");
};

// do clean up for the modal
const onHiddenBsModal = () => {
  const modalBackDrops = document.body.getElementsByClassName("modal-backdrop");

  for (let modal = 0; modal < modalBackDrops.length; modal++) {
    const modalEl = modalBackDrops[modal];
    document.body.removeChild(modalEl);
  }
};
</script>

<style scoped></style>
