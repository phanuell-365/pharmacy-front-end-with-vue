<template>
  <section class="suppliers-view">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>View all Suppliers</template>
      <template #body>
        <ViewSuppliers />
      </template>
      <template #footer>
        <ButtonIcon
          :icon="NEW_SUPPLIERS_ICON"
          color="primary"
          name="suppliers"
          outline
          role="button"
          text="Create Supplier"
          to="/suppliers/create"
        />
      </template>
    </SidebarLayout>
  </section>
</template>

<script lang="ts" setup>
import SidebarLayout from "@/layouts/SidebarLayout.vue";
import SidebarNavigation from "@/components/sidebar/SidebarNavigation.vue";
import ButtonIcon from "@/components/Buttons/ButtonIcon.vue";
import ViewSuppliers from "@/components/app/suppliers/ViewSuppliers.vue";
import { NEW_SUPPLIERS_ICON } from "@/constants/icons";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name);

menuStore.activateSubMenu("suppliers", routeName);

onBeforeRouteLeave((to, from) => {
  const modalBackDrops = document.body.getElementsByClassName("modal-backdrop");

  for (let modal = 0; modal < modalBackDrops.length; modal++) {
    const modalEl = modalBackDrops[modal];
    document.body.removeChild(modalEl);
  }
});
</script>

<style scoped></style>
