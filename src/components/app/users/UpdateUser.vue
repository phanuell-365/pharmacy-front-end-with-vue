<template>
  <section>
    <Teleport to="body">
      <SimpleModal ref="errorLoadingUserRef" centered danger static-backdrop>
        <ModalButton color="danger" text="go back" @click="onCloseModal" />
      </SimpleModal>
    </Teleport>
    <div v-if="error.errorState">
      <!--      <p class="display-5 text-danger">-->
      <!--        An Error Occurred. {{ error.message }}-->
      <!--      </p>-->

      <FormPlaceholder />
    </div>
    <div v-if="isLoading">
      <FormPlaceholder />
    </div>
    <div v-else-if="!error.errorState">
      <form class="row g-3 m-4" novalidate @submit.prevent="onFormSubmit">
        <div class="col-md-4">
          <label class="form-label" for="validationUsername">Username</label>
          <input
            id="validationUsername"
            v-model.trim="username"
            class="form-control"
            name="username"
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
            type="tel"
          />
          <div class="invalid-feedback">Please enter a phone</div>
        </div>
        <FormButton name="update" type="submit" /><!-- Button trigger modal -->
      </form>
    </div>
    <Teleport to="body">
      <SimpleModal ref="modalRef" :centered="false" static-backdrop>
        <template #buttons>
          <CloseButton
            color="primary"
            text="okay"
            @oncloseclick="onCloseClickHandler"
          />
          <CloseButton
            color="danger"
            text="cancel"
            @oncloseclick="onCloseClickHandler"
          />
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
import { useUsersStore } from "@/stores/app/users";
import _ from "lodash";
import type { UpdateUserDto } from "@/interfaces";
import CloseButton from "@/components/modal/CloseButton.vue";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import LiveToast from "@/components/toast/LiveToast.vue";
import SimpleModal from "@/components/modal/SimpleModal.vue";
import ModalButton from "@/components/modal/ModalButton.vue";
import { useRouter } from "vue-router";

const FormPlaceholder = defineAsyncComponent(
  () => import("@/components/form/placeholder/FormPlaceholder.vue")
);

const FormButton = defineAsyncComponent(
  () => import("@/components/form/FormButton.vue")
);

const errorLoadingUserRef = ref<InstanceType<typeof SimpleModal> | null>(null);

const router = useRouter();

const usersStore = useUsersStore();

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

interface UpdateUserProps {
  userId: string;
}

const props = defineProps<UpdateUserProps>();

const user: Ref<UpdateUserDto> = ref({});
const isLoading = ref(false);

const error = reactive({
  errorState: false,
  message: "",
});

const usersRoles: Ref<string[] | undefined> = ref();

const username: Ref<UpdateUserDto["username"]> = ref();
const password: Ref<UpdateUserDto["password"]> = ref();
const email: Ref<UpdateUserDto["email"]> = ref();
const phone: Ref<UpdateUserDto["phone"]> = ref();
const role: Ref<UpdateUserDto["role"]> = ref();

onMounted(async () => {
  try {
    isLoading.value = true;

    user.value = await usersStore.loadUserById(props.userId);

    username.value = user.value.username;
    password.value = user.value.password;
    email.value = user.value.email;
    phone.value = user.value.phone;
    role.value = user.value.role;

    usersRoles.value = await usersStore.loadUsersRoles();
    isLoading.value = false;
  } catch (e: any) {
    error.errorState = true;
    error.message = e.message;

    if (!error.message.includes("Unauthorized")) {
      errorLoadingUserRef.value?.modalText(error.message);
      errorLoadingUserRef.value?.modalTitle("Error");
      errorLoadingUserRef.value?.show();
      console.log(errorLoadingUserRef);
    }
    console.error(e);
  }
});

const onCloseModal = (clickedButton: string) => {
  modalRef.value?.hide();
  router.back();
};

const clickedButton = ref();

const toastRefDanger = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefSuccess = ref<InstanceType<typeof LiveToast> | null>(null);

const onCloseClickHandler = (clickedBtn: string) => {
  clickedButton.value = clickedBtn;
};

const onFormSubmit = async () => {
  const payload: UpdateUserDto = {};

  if (username.value) {
    payload.username = username.value;
  }
  if (password.value) {
    payload.password = password.value;
  }
  if (email.value) {
    payload.email = email.value;
  }
  if (role.value) {
    payload.role = role.value;
  }
  if (phone.value) {
    payload.phone = phone.value;
  }

  try {
    const success = await usersStore.updateUser(props.userId, payload);
    if (success) {
      toastRefSuccess.value?.toastText("The user was updated successfully!");
      toastRefSuccess.value?.toastElapsedDuration("Just now");
      toastRefSuccess.value?.toastHeading("User update");
      toastRefSuccess.value?.toastName("user-update");
      toastRefSuccess.value?.show();
    }
  } catch (error: any) {
    toastRefDanger.value?.toastText(`An error occurred! ${error.message}`);
    toastRefDanger.value?.toastElapsedDuration("Just now");
    toastRefDanger.value?.toastHeading("Error");
    toastRefDanger.value?.toastName("user-update-error");
    toastRefDanger.value?.show();
  }
};

const onHiddenBsToastHandlerSuccess = async () => {
  await router.push({ name: "view-users" });
};
</script>

<style scoped></style>
