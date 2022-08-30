<template>
  <section>
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>
        <span>Update Patient</span>
      </template>
      <template #body>
        <UpdateUser :user-id="props.id" />
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="NEW_USER_ICON"
            color="primary"
            name="patients"
            outline
            role="button"
            text="Create User"
            to="/patients/create"
          />
          <ButtonIcon
            :icon="PATIENTS_ICON"
            :to="`/patients/`"
            color="info"
            name="patients"
            role="button"
            text="View patients"
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
import { useMenuStore } from "@/stores/menu";
import { useRoute } from "vue-router";
import { NEW_USER_ICON, PATIENTS_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name);

menuStore.activateSubMenu("patients", routeName);

interface UserViewProps {
  id: string;
}

const props = defineProps<UserViewProps>();
</script>

<style scoped></style>
