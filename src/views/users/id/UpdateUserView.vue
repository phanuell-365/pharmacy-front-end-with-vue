<template>
  <section class="update-user-view">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>
        <span>Update User</span>
      </template>
      <template #body>
        <UpdateUser :user-id="props.id" />
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
          <ButtonIcon
            :icon="USERS_ICON"
            :to="`/users/`"
            color="info"
            name="users"
            role="button"
            text="View users"
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
import UpdateUser from "@/components/app/users/UpdateUser.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { NEW_USER_ICON, USERS_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name);

menuStore.activateSubMenu("users", routeName);

interface UserViewProps {
  id: string;
}

const props = defineProps<UserViewProps>();

onBeforeRouteLeave((to, from) => {
  const modalBackDrops = document.body.getElementsByClassName("modal-backdrop");

  for (let modal = 0; modal < modalBackDrops.length; modal++) {
    const modalEl = modalBackDrops[modal];
    document.body.removeChild(modalEl);
  }
});
</script>

<style scoped></style>
