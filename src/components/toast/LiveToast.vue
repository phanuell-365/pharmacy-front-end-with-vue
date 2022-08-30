<template>
  <div :class="placement" class="position-fixed p-3">
    <div
      :id="`liveToast-${exposedProps.name}`"
      ref="toastRef"
      :aria-live="ariaLive"
      :class="skinColorClasses"
      :data-bs-delay="delayToast"
      :role="role"
      aria-atomic="true"
      class="toast border-0"
    >
      <div class="toast-header">
        <FontAwesome :icon-name="iconName" class="mx-2" />
        <strong class="me-auto">{{ exposedProps.heading }}</strong>
        <small>{{ exposedProps.elapsedDuration }}</small>
        <button
          aria-label="Close"
          class="btn-close"
          data-bs-dismiss="toast"
          type="button"
        ></button>
      </div>
      <div class="toast-body">{{ exposedProps.text }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Ref } from "vue";
import {
  computed,
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from "vue";
import {
  BELL_ICON,
  CONFIRM_ICON,
  DANGER_ICON,
  INFO_ICON,
  OK_ICON,
  WARNING_ICON,
} from "@/constants/icons";
import {
  BOTTOM_RIGHT,
  CONFIRM_SKIN,
  DANGER_SKIN,
  DEFAULT_SKIN,
  INFO_SKIN,
  OK_SKIN,
  SUCCESS_SKIN,
  TOP_RIGHT,
  WARNING_SKIN,
} from "@/constants/toasts";
import * as bootstrap from "bootstrap";

const FontAwesome = defineAsyncComponent(
  () => import("@/components/icons/FontAwesome.vue")
);

interface LiveToastProps {
  name: string;
  elapsedDuration: string;
  heading: string;
  text: string;
  delay: number;
}

interface SkinProp {
  skin: string;
}

const props = defineProps<SkinProp>();

const exposedProps: LiveToastProps = reactive({
  name: "",
  elapsedDuration: "",
  heading: "",
  text: "",
  delay: Number(),
});

defineExpose({
  toastName: (prop: string) => (exposedProps.name = prop),
  toastElapsedDuration: (prop: string) => (exposedProps.elapsedDuration = prop),
  toastHeading: (prop: string) => (exposedProps.heading = prop),
  toastText: (prop: string) => (exposedProps.text = prop),
  toastDelay: (prop: number) => (exposedProps.delay = prop),
  show: () => newToast.value.show(),
});

const toastRef = ref<HTMLDivElement | null>(null);

const newToast = ref();

onMounted(() => {
  newToast.value = new bootstrap.Toast(toastRef.value as HTMLDivElement);
});

const delayToast = computed(() =>
  exposedProps.delay ? exposedProps.delay : 5000
);

const skinColorClasses: Ref<string | null> = ref(null);
const iconName: Ref<string | null> = ref(null);
const placement: Ref<string | null> = ref(null);

switch (props.skin) {
  case "ok":
    iconName.value = OK_ICON;
    skinColorClasses.value = OK_SKIN;
    placement.value = BOTTOM_RIGHT;
    break;
  case "info":
    iconName.value = INFO_ICON;
    skinColorClasses.value = INFO_SKIN;
    placement.value = TOP_RIGHT;
    break;
  case "success":
    iconName.value = BELL_ICON;
    skinColorClasses.value = SUCCESS_SKIN;
    placement.value = TOP_RIGHT;
    break;
  case "confirm":
    iconName.value = CONFIRM_ICON;
    skinColorClasses.value = CONFIRM_SKIN;
    placement.value = BOTTOM_RIGHT;
    break;
  case "warning":
    iconName.value = WARNING_ICON;
    skinColorClasses.value = WARNING_SKIN;
    placement.value = BOTTOM_RIGHT;
    break;
  case "danger":
    iconName.value = DANGER_ICON;
    skinColorClasses.value = DANGER_SKIN;
    placement.value = TOP_RIGHT;
    break;
  default:
    iconName.value = OK_ICON;
    skinColorClasses.value = DEFAULT_SKIN;
    placement.value = BOTTOM_RIGHT;
}

const role = computed(() => (props.skin !== "ok" ? "alert" : "status"));
const ariaLive = computed(() => (props.skin !== "ok" ? "assertive" : "polite"));

const emit = defineEmits(["on-hidden-bs-toast"]);

onMounted(() => {
  toastRef.value?.addEventListener("hidden.bs.toast", () => {
    emit("on-hidden-bs-toast");
  });
});

onUnmounted(() => {
  toastRef.value?.removeEventListener("hidden.bs.toast", () => {
    console.log("the hidden bs toast event");
  });
});
</script>

<style scoped>
.toast-container {
  z-index: 11;
}
</style>
