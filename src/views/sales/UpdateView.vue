<template>
  <section class="update-sales">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>
        <span>Select a sale to update</span>
      </template>
      <template #body>
        <div>
          <ViewSales clickable href="update" />
        </div>
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="ORDERS_ICON"
            color="primary"
            name="sales"
            outline
            role="button"
            text="Create Sale"
            to="/sales/create"
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
import ViewSales from "@/components/app/sales/ViewSales.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { ORDERS_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name);

menuStore.activateSubMenu("sales", routeName);

onBeforeRouteLeave((to, from) => {
  const modalBackDrops = document.body.getElementsByClassName("modal-backdrop");

  for (let modal = 0; modal < modalBackDrops.length; modal++) {
    const modalEl = modalBackDrops[modal];
    document.body.removeChild(modalEl);
  }
});
</script>

<style scoped></style>
