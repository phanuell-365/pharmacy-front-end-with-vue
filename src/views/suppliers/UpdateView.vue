<template>
  <section class="update-suppliers">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>
        <span>Select a supplier to update</span>
      </template>
      <template #body>
        <div>
          <ViewSuppliers clickable href="update" />
        </div>
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="NEW_SUPPLIERS_ICON"
            color="primary"
            name="suppliers"
            outline
            role="button"
            text="Create Supplier"
            to="/suppliers/create"
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
import ViewSuppliers from "@/components/app/suppliers/ViewSuppliers.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { NEW_SUPPLIERS_ICON } from "@/constants/icons";

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
