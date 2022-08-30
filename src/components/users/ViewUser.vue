<template>
  <section>
    <div v-if="error.errorState">
      <!--      <p class="display-5 text-danger">-->
      <!--        An Error Occurred. {{ error.message }}-->
      <!--      </p>-->
      <FormPlaceholder />
    </div>
    <div v-else-if="isLoading">
      <FormPlaceholder />
    </div>
    <div v-else-if="!error.errorState">
      <DisabledForm :record="user" />
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
import { useUsersStore } from "@/stores/app/users";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import SimpleModal from "@/components/modal/SimpleModal.vue";
import ModalButton from "@/components/modal/CloseButton.vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";

const FormPlaceholder = defineAsyncComponent(
  () => import("@/components/form/placeholder/FormPlaceholder.vue")
);

const DisabledForm = defineAsyncComponent(
  () => import("@/components/form/disabled/DisabledForm.vue")
);

const router = useRouter();

const modalRef = ref<InstanceType<typeof SimpleModal> | null>(null);

const usersStore = useUsersStore();

interface ViewUserProps {
  userId: string;
}

const props = defineProps<ViewUserProps>();

const user = ref({});
const isLoading = ref(false);

const error = reactive({
  errorState: false,
  message: "",
});

onMounted(async () => {
  try {
    isLoading.value = true;
    user.value = await usersStore.loadUserById(props.userId);
    isLoading.value = false;
  } catch (e: any) {
    error.errorState = true;
    error.message = e.message;
    modalRef.value?.modalText(error.message);
    modalRef.value?.modalTitle("Error");
    modalRef.value?.show();
    console.error(e);
  }
});

onBeforeRouteLeave((to, from, next) => {
  if (props.userId === "update") {
    return "/users/update";
  }
  next();
});

const onCloseModal = (clickedButton: string) => {
  modalRef.value?.hide();
  router.back();
};
</script>

<style scoped></style>
