<template>
  <section class="users-view">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading> Users</template>
      <template #body>
        <ViewUsers />
      </template>
      <template #footer>
        <ButtonIcon
          :icon="NEW_USER_ICON"
          color="primary"
          name="users"
          outline
          role="button"
          text="Create User"
          to="/users/create"
        />
      </template>
    </SidebarLayout>
  </section>
</template>

<script lang="ts" setup>
import SidebarLayout from "@/layouts/SidebarLayout.vue";
import SidebarNavigation from "@/components/sidebar/SidebarNavigation.vue";
import ViewUsers from "@/components/app/users/ViewUsers.vue";
import ButtonIcon from "@/components/Buttons/ButtonIcon.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { NEW_USER_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name);

menuStore.activateSubMenu("users", routeName);

onBeforeRouteLeave((to, from) => {
  const modalBackDrops = document.body.getElementsByClassName("modal-backdrop");

  for (let modal = 0; modal < modalBackDrops.length; modal++) {
    const modalEl = modalBackDrops[modal];
    document.body.removeChild(modalEl);
  }
});
</script>

<style scoped></style>
