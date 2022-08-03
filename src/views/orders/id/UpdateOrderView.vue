<template>
  <section class="update-order-view">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>
        <span>Update Order</span>
      </template>
      <template #body>
        <UpdateOrder :order-id="props.id" />
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="EDIT_ORDER_ICON"
            color="primary"
            name="order"
            outline
            role="button"
            text="Create Order"
            to="/orders/create"
          />
          <ButtonIcon
            :icon="ORDERS_ICON"
            :to="`/orders`"
            color="info"
            name="orders"
            role="button"
            text="View Order"
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
import UpdateOrder from "@/components/app/orders/UpdateOrder.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { EDIT_ORDER_ICON, ORDERS_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name) + "s";

menuStore.activateSubMenu("orders", routeName);

interface UpdateInventoryProps {
  id: string;
}

const props = defineProps<UpdateInventoryProps>();

onBeforeRouteLeave((to, from) => {
  const modalBackDrops = document.body.getElementsByClassName("modal-backdrop");

  for (let modal = 0; modal < modalBackDrops.length; modal++) {
    const modalEl = modalBackDrops[modal];
    document.body.removeChild(modalEl);
  }
});
</script>

<style scoped></style>
