<template>
  <section class="create-supply">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>Create Supply</template>
      <template #body>
        <CreateSupply :order-id="props.orderId" />
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="ORDERS_ICON"
            color="primary"
            name="supply"
            outline
            role="button"
            text="View Supply"
            to="/supplies"
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
import CreateSupply from "@/components/app/supplies/CreateSupply.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave } from "vue-router";
import { ORDERS_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

menuStore.activateSubMenu("supplies", "supplies-orders");

interface CreateSupplyProps {
  orderId: string;
}

const props = defineProps<CreateSupplyProps>();

onBeforeRouteLeave((to, from) => {
  const modalBackDrops = document.body.getElementsByClassName("modal-backdrop");

  for (let modal = 0; modal < modalBackDrops.length; modal++) {
    const modalEl = modalBackDrops[modal];
    document.body.removeChild(modalEl);
  }
});
</script>

<style scoped></style>
