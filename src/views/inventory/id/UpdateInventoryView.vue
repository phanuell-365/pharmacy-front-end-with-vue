<template>
  <section class="update-user-view">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>
        <span>Update Inventory</span>
      </template>
      <template #body>
        <UpdateInventory :inventory-id="props.id" />
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="EDIT_INVENTORY_ICON"
            color="primary"
            name="inventory"
            outline
            role="button"
            text="Create inventory"
            to="/inventory/create"
          />
          <ButtonIcon
            :icon="INVENTORY_ICON"
            :to="`/inventory/`"
            color="info"
            name="users"
            role="button"
            text="View inventory"
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
import UpdateInventory from "@/components/app/inventory/UpdateInventory.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave } from "vue-router";
import { EDIT_INVENTORY_ICON, INVENTORY_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

menuStore.activateSubMenu("inventory", "update-inventories");

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
