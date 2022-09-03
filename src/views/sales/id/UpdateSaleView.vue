<template>
  <SidebarLayout>
    <template #sidebar>
      <SidebarNavigation :menus="menuStore.menu" />
    </template>
    <template #heading>
      <span>Update Sale</span>
    </template>
    <template #body>
      <UpdateSale :sales-id="props.id" />
    </template>
    <template #footer>
      <div class="btn-group">
        <ButtonIcon
          :icon="EDIT_SALE_ICON"
          color="primary"
          name="sale"
          outline
          role="button"
          text="Create Sale"
          to="/sales/create"
        />
        <ButtonIcon
          :icon="SALES_ICON"
          :to="`/sales`"
          color="info"
          name="sales"
          role="button"
          text="View Sale"
        />
      </div>
    </template>
  </SidebarLayout>
</template>

<script lang="ts" setup>
import SidebarLayout from "@/layouts/SidebarLayout.vue";
import SidebarNavigation from "@/components/sidebar/SidebarNavigation.vue";
import ButtonIcon from "@/components/Buttons/ButtonIcon.vue";
import UpdateSale from "@/components/app/sales/UpdateSale.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { EDIT_SALE_ICON, SALES_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name) + "s";

menuStore.activateSubMenu("sales", routeName);

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
