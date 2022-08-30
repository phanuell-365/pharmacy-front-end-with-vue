<template>
  <section>
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
import CreateUser from "@/components/users/CreateUser.vue";
import ButtonIcon from "@/components/Buttons/ButtonIcon.vue";
import { useMenuStore } from "@/stores/menu";
import { useRoute } from "vue-router";
import { USERS_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name);
menuStore.activateSubMenu("users", routeName);
</script>

<style scoped></style>
