<template>
  <section class="update-supply-view">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>
        <span>Update supply</span>
      </template>
      <template #body>
        <UpdateSupply :supply-id="props.id" />
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="EDIT_SUPPLY_ICON"
            color="primary"
            name="supply"
            outline
            role="button"
            text="Create Supply"
            to="/supplies/orders"
          />
          <ButtonIcon
            :icon="SUPPLIES_ICON"
            :to="`/supplies`"
            color="info"
            name="supplies"
            role="button"
            text="View Supplies"
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
import UpdateSupply from "@/components/app/supplies/UpdateSupply.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave } from "vue-router";
import { EDIT_SUPPLY_ICON, SUPPLIES_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

menuStore.activateSubMenu("supplies", "update-supplies");

interface UpdateSupplyProps {
  id: string;
}

const props = defineProps<UpdateSupplyProps>();

onBeforeRouteLeave((to, from) => {
  const modalBackDrops = document.body.getElementsByClassName("modal-backdrop");

  for (let modal = 0; modal < modalBackDrops.length; modal++) {
    const modalEl = modalBackDrops[modal];
    document.body.removeChild(modalEl);
  }
});
</script>

<style scoped></style>
