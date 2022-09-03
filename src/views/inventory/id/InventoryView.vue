<template>
  <section class="user-view">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>Inventory</template>
      <template #body>
        <ViewInventory :inventory-id="props.id" />
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="INVENTORY_ICON"
            color="primary"
            name="inventory"
            outline
            role="button"
            text="Create Inventory"
            to="/inventory/create"
          />
          <ButtonIcon
            :icon="EDIT_INVENTORY_ICON"
            :to="`/inventory/${props.id}/update`"
            color="secondary"
            name="inventory"
            role="button"
            text="Update Inventory"
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
import ViewInventory from "@/components/app/inventory/ViewInventory.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { EDIT_INVENTORY_ICON, INVENTORY_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name);

menuStore.activateSubMenu("inventory", routeName);

interface InventoryViewProps {
  id: string;
}

const props = defineProps<InventoryViewProps>();

onBeforeRouteLeave((to, from) => {
  const modalBackDrops = document.body.getElementsByClassName("modal-backdrop");

  for (let modal = 0; modal < modalBackDrops.length; modal++) {
    const modalEl = modalBackDrops[modal];
    document.body.removeChild(modalEl);
  }
});
</script>

<style scoped></style>
