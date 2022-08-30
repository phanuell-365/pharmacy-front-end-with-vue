<template>
  <div ref="theToast" class="card border-light w-50 m-auto my-3">
    <FormBody @form-submit="onFormSubmitHandler">
      <template #input>
        <div class="justify-content-center">
          <FormInput
            col="col-md-12"
            invalid-feedback="Please enter a username"
            label="Username"
            name="username"
            type="text"
            @input-blur="onInputBlurHandler"
          />
        </div>
        <div>
          <FormInput
            col="col-md-12"
            invalid-feedback="Please enter the password"
            label="Password"
            name="password"
            type="password"
            @input-blur="onInputBlurHandler"
          />
        </div>
      </template>
      <template #button>
        <FormButton name="Login" type="submit" />
      </template>
    </FormBody>
    <Teleport to="body">
      <LiveToast
        ref="toastRefDanger"
        skin="danger"
        @on-hidden-bs-toast="onHiddenBsToastHandlerDanger"
      />
      <LiveToast
        ref="toastRefWarning"
        skin="warning"
        @on-hidden-bs-toast="onHiddenBsToastHandlerWarning"
      />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import type { Ref } from "vue";
import { defineAsyncComponent, ref } from "vue";
import { useLoginStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import LiveToast from "@/components/toast/LiveToast.vue";
// import { OK_ICON } from "@/constants/icons";
// import FontAwesome from "@/components/icons/FontAwesome.vue";

const FormBody = defineAsyncComponent(
  () => import("@/components/form/FormBody.vue")
);
const FormInput = defineAsyncComponent(
  () => import("@/components/form/FormInput.vue")
);
const FormButton = defineAsyncComponent(
  () => import("@/components/form/FormButton.vue")
);

// const LiveToast = defineAsyncComponent(
//   () => import("@/components/toast/LiveToast.vue")
// );

const router = useRouter();

const authDuration = ref(String());

const loginStore = useLoginStore();

const NUMBER_OF_USER_ATTRIBUTES = 2;

interface FormInputEmitType {
  name: string;
  value: Ref<null | string | number | undefined>;
}

const userInputs = ref<FormInputEmitType[]>([]);

const onInputBlurHandler = (userInput: FormInputEmitType) => {
  userInputs.value.push({
    name: userInput.name,
    value: userInput.value.value,
  });

  // console.log(userInput);
};

const isFormValid = () => {
  // if the userInputs array is empty, return false
  if (
    userInputs.value.length === 0 ||
    userInputs.value.length < NUMBER_OF_USER_ATTRIBUTES
  ) {
    return false;
  } else
    return userInputs.value.every(
      (userInput) => !(userInput.value === null || userInput.value === "")
    );
};

const toastRefDanger = ref<InstanceType<typeof LiveToast> | null>(null);
const toastRefWarning = ref<InstanceType<typeof LiveToast> | null>(null);

const errorState = ref(false);

const onFormSubmitHandler = async (event: Event) => {
  const form = event.target as HTMLFormElement;

  if (!isFormValid()) {
    form.classList.add("was-validated");
  } else {
    form.classList.remove("was-validated");

    interface AuthDto {
      [name: string]: string | number | null | undefined;
    }

    // create a new user object
    const payload: AuthDto = {};

    // loop through the userInputs array and add the user input values to the new user object
    userInputs.value.forEach((userInput) => {
      payload[userInput.name] = userInput.value;
    });

    // console.log("The new -> ", payload);

    const response = ref();

    try {
      response.value = await loginStore.login({
        username: payload.username,
        password: payload.password,
      });

      if (response.value) {
        authDuration.value = loginStore.authDuration;

        toastRefWarning.value?.toastText(
          `Logged in till ${loginStore.authDuration}`
        );
        toastRefWarning.value?.toastElapsedDuration("Just now");
        toastRefWarning.value?.toastHeading("Authentication");
        toastRefWarning.value?.toastName("authWarning");
        toastRefWarning.value?.show();
      }
    } catch (error: any) {
      errorState.value = true;
      toastRefDanger.value?.toastText(`An error occurred! ${error.message}`);
      toastRefDanger.value?.toastElapsedDuration("Just now");
      toastRefDanger.value?.toastHeading("Error");
      toastRefDanger.value?.toastName("authError");
      toastRefDanger.value?.show();
      console.error(error);
    }

    flushUserInputs();
  }
};

// flush the values of userInputs array
const flushUserInputs = () => {
  userInputs.value.forEach((userInput) => {
    userInput.value = "";
  });
  // router.push("/users");
};

const onHiddenBsToastHandlerDanger = () => {
  router.push("/login");
};

const onHiddenBsToastHandlerWarning = async () => {
  await router.push({ name: "view-users" });
};
</script>

<style scoped></style>
