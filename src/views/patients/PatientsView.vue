<template>
  <section>
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>View all Patients</template>
      <template #body>
        <ViewPatients />
      </template>
      <template #footer>
        <ButtonIcon
          :icon="NEW_USER_ICON"
          color="primary"
          name="patients"
          outline
          role="button"
          text="Create Patient"
          to="/patients/create"
        />
      </template>
    </SidebarLayout>
  </section>
</template>

<script lang="ts" setup>
import SidebarLayout from "@/layouts/SidebarLayout.vue";
import SidebarNavigation from "@/components/sidebar/SidebarNavigation.vue";
import ButtonIcon from "@/components/Buttons/ButtonIcon.vue";
import ViewPatients from "@/components/app/patients/ViewPatients.vue";
import { NEW_USER_ICON } from "@/constants/icons";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name);

menuStore.activateSubMenu("patients", routeName);

onBeforeRouteLeave((to, from) => {
  const modalBackDrops = document.body.getElementsByClassName("modal-backdrop");

  for (let modal = 0; modal < modalBackDrops.length; modal++) {
    const modalEl = modalBackDrops[modal];
    document.body.removeChild(modalEl);
  }
});
</script>

<style scoped></style>
