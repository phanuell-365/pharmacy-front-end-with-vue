<template>
  <section class="update-users">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>
        <span>Select a user to update</span>
      </template>
      <template #body>
        <div>
          <ViewUsers clickable href="update" />
        </div>
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="NEW_USER_ICON"
            color="primary"
            name="users"
            outline
            role="button"
            text="Create User"
            to="/users/create"
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
import ViewUsers from "@/components/app/users/ViewUsers.vue";
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
