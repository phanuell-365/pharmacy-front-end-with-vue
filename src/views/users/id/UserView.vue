<template>
  <section class="user-view">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading> User</template>
      <template #body>
        <ViewUser :user-id="props.id" />
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
            :icon="EDIT_USER_ICON"
            :to="`/users/${props.id}/update`"
            color="secondary"
            name="users"
            role="button"
            text="Update User"
          />
        </div>
      </template>
    </SidebarLayout>
  </section>
</template>

<script lang="ts" setup>
import SidebarLayout from "@/layouts/SidebarLayout.vue";
import SidebarNavigation from "@/components/sidebar/SidebarNavigation.vue";
import ViewUser from "@/components/app/users/ViewUser.vue";
import ButtonIcon from "@/components/Buttons/ButtonIcon.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { EDIT_USER_ICON, NEW_USER_ICON } from "@/constants/icons";

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
