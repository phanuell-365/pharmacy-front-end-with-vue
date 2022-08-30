<template>
  <section class="supplier-view">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>Supplier</template>
      <template #body>
        <ViewSupplier :supplier-id="props.id" />
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
          <ButtonIcon
            :icon="EDIT_SUPPLIERS_ICON"
            :to="`/suppliers/${props.id}/update`"
            color="secondary"
            name="suppliers"
            role="button"
            text="Update Supplier"
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
import ViewSupplier from "@/components/app/suppliers/ViewSupplier.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { EDIT_SUPPLIERS_ICON, NEW_SUPPLIERS_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name);

menuStore.activateSubMenu("suppliers", routeName);

interface SupplierViewProps {
  id: string;
}

const props = defineProps<SupplierViewProps>();

onBeforeRouteLeave((to, from) => {
  const modalBackDrops = document.body.getElementsByClassName("modal-backdrop");

  for (let modal = 0; modal < modalBackDrops.length; modal++) {
    const modalEl = modalBackDrops[modal];
    document.body.removeChild(modalEl);
  }
});
</script>

<style scoped></style>
