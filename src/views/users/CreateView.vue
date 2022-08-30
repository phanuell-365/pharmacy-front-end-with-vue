<template>
  <section class="create-user">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading> User</template>
      <template #body>
        <KeepAlive>
          <CreateUser />
        </KeepAlive>
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="USERS_ICON"
            color="primary"
            name="users"
            outline
            role="button"
            text="View Users"
            to="/users"
          />
        </div>
      </template>
    </SidebarLayout>
  </section>
</template>

<script lang="ts" setup>
import SidebarLayout from "@/layouts/SidebarLayout.vue";
import SidebarNavigation from "@/components/sidebar/SidebarNavigation.vue";
import CreateUser from "@/components/app/users/CreateUser.vue";
import ButtonIcon from "@/components/Buttons/ButtonIcon.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { USERS_ICON } from "@/constants/icons";

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
