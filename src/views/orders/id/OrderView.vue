<template>
  <section class="order-view">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>Order</template>
      <template #body>
        <ViewOrder :order-id="props.id" />
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="ORDERS_ICON"
            color="primary"
            name="order"
            outline
            role="button"
            text="Create Order"
            to="/orders/create"
          />
          <ButtonIcon
            :icon="EDIT_ORDER_ICON"
            :to="`/orders/${props.id}/update`"
            color="secondary"
            name="order"
            role="button"
            text="Update Order"
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
import ViewOrder from "@/components/app/orders/ViewOrder.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { EDIT_ORDER_ICON, ORDERS_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name);

menuStore.activateSubMenu("orders", routeName);

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
