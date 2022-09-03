<template>
  <section class="supply-view">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>Supply</template>
      <template #body>
        <ViewSupply :supply-id="props.id" />
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="SUPPLIES_ICON"
            color="primary"
            name="supplies"
            outline
            role="button"
            text="Create Supply"
            to="/supplies/orders"
          />
          <ButtonIcon
            :icon="EDIT_SUPPLY_ICON"
            :to="`/supplies/${props.id}/update`"
            color="secondary"
            name="supplies"
            role="button"
            text="Update Supply"
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
import ViewSupply from "@/components/app/supplies/ViewSupply.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { EDIT_SUPPLY_ICON, SUPPLIES_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name);

menuStore.activateSubMenu("supplies", routeName);

interface SupplyViewProps {
  id: string;
}

const props = defineProps<SupplyViewProps>();

onBeforeRouteLeave((to, from) => {
  const modalBackDrops = document.body.getElementsByClassName("modal-backdrop");

  for (let modal = 0; modal < modalBackDrops.length; modal++) {
    const modalEl = modalBackDrops[modal];
    document.body.removeChild(modalEl);
  }
});
</script>

<style scoped></style>
