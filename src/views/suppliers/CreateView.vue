<template>
  <section>
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>Create Supplier</template>
      <template #body>
        <CreateSupplier />
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="SUPPLIERS_ICON"
            color="primary"
            name="suppliers"
            outline
            role="button"
            text="View Suppliers"
            to="/suppliers"
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
import CreateSupplier from "@/components/app/suppliers/CreateSupplier.vue";
import { SUPPLIERS_ICON } from "@/constants/icons";
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
