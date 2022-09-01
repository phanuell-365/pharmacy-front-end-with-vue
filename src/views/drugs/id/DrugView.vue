<template>
  <section class="user-view">
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>Drug</template>
      <template #body>
        <ViewDrug :drug-id="props.id" />
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="NEW_DRUGS_ICON"
            color="primary"
            name="drugs"
            outline
            role="button"
            text="Create Drug"
            to="/drugs/create"
          />
          <ButtonIcon
            :icon="EDIT_DRUG_ICON"
            :to="`/drugs/${props.id}/update`"
            color="secondary"
            name="drugs"
            role="button"
            text="Update Drug"
          />
        </div>
      </template>
    </SidebarLayout>
  </section>
</template>

<script lang="ts" setup>
import SidebarLayout from "@/layouts/SidebarLayout.vue";
import SidebarNavigation from "@/components/sidebar/SidebarNavigation.vue";
import ViewDrug from "@/components/app/drugs/ViewDrug.vue";
import ButtonIcon from "@/components/Buttons/ButtonIcon.vue";
import { useMenuStore } from "@/stores/menu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { EDIT_DRUG_ICON, NEW_DRUGS_ICON } from "@/constants/icons";

const menuStore = useMenuStore();

const route = useRoute();

const routeName = String(route.name);

menuStore.activateSubMenu("drugs", routeName);

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
