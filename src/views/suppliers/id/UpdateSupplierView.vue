<template>
  <section>
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>
        <span>Update Suppliers</span>
      </template>
      <template #body>
        <UpdateSupplier :supplier-id="props.id" />
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
            :icon="SUPPLIERS_ICON"
            :to="`/suppliers/`"
            color="info"
            name="suppliers"
            role="button"
            text="View suppliers"
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
import UpdateSupplier from "@/components/app/suppliers/UpdateSupplier.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { NEW_SUPPLIERS_ICON, SUPPLIERS_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name) + "s";

menuStore.activateSubMenu("suppliers", routeName);

interface UserViewProps {
  id: string;
}

const props = defineProps<UserViewProps>();

onBeforeRouteLeave((to, from) => {
  const modalBackDrops = document.body.getElementsByClassName("modal-backdrop");

  for (let modal = 0; modal < modalBackDrops.length; modal++) {
    const modalEl = modalBackDrops[modal];
    document.body.removeChild(modalEl);
  }
});
</script>

<style scoped></style>
