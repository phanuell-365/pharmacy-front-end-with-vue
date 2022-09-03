<template>
  <section class="sale-view">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>Sale</template>
      <template #body>
        <ViewSale :sale-id="props.id" />
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="SALES_ICON"
            color="primary"
            name="sales"
            outline
            role="button"
            text="Create Sale"
            to="/sales/create"
          />
          <ButtonIcon
            :icon="EDIT_SALE_ICON"
            :to="`/sales/${props.id}/update`"
            color="secondary"
            name="sales"
            role="button"
            text="Update Sale"
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
import ViewSale from "@/components/app/sales/ViewSale.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { EDIT_SALE_ICON, SALES_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name);

menuStore.activateSubMenu("sales", routeName);

interface OrderViewProps {
  id: string;
}

const props = defineProps<OrderViewProps>();

onBeforeRouteLeave((to, from) => {
  const modalBackDrops = document.body.getElementsByClassName("modal-backdrop");

  for (let modal = 0; modal < modalBackDrops.length; modal++) {
    const modalEl = modalBackDrops[modal];
    document.body.removeChild(modalEl);
  }
});
</script>

<style scoped></style>
