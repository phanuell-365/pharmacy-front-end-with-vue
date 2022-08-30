<template>
  <section>
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>Create Patient</template>
      <template #body>
        <CreatePatient />
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="PATIENTS_ICON"
            color="primary"
            name="users"
            outline
            role="button"
            text="View Patients"
            to="/patients"
          />
        </div>
      </template>
    </SidebarLayout>
  </section>
</template>

<script lang="ts" setup>
import SidebarLayout from "@/layouts/SidebarLayout.vue";
import SidebarNavigation from "@/components/sidebar/SidebarNavigation.vue";
import ButtonIcon from "@/components/Buttons/ButtonIcon.vue";
import CreatePatient from "@/components/patients/CreatePatient.vue";
import { PATIENTS_ICON } from "@/constants/icons";
import { useMenuStore } from "@/stores/menu";
import { useRoute } from "vue-router";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name);
menuStore.activateSubMenu("patients", routeName);
</script>

<style scoped></style>
