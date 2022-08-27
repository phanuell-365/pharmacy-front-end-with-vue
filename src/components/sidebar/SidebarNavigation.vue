<template>
  <RouterLink
    class="d-flex align-items-center mb-4 mb-md-0 me-md-auto link-dark text-decoration-none"
    to="/users"
  >
    <i class="fa-solid fa-clinic-medical fs-1 p-2"></i>
    <span class="fs-4">ResTechs</span>
  </RouterLink>
  <section class="mt-3">
    <SidebarBody :menus="menus" />
  </section>
</template>

<script lang="ts" setup>
import SidebarBody from "./SidebarBody.vue";

interface Submenu {
  // a brief text to describe the submenu
  desc: string;
  // the submenu's name
  name: string;
  // the link to the page to go to
  href: string;
  // the name of the router
  routeName: string;
  // the submenu's icon
  ico: string;
  // tells whether the submenu is active or not
  active: boolean;
}

interface MainMenu {
  // the name of the menu
  name: string;
  // the menu's icon
  ico: string;
  // tell whether the current menu is active
  active: boolean;
  // the menu's submenus
  submenus: Submenu[];
}

interface SidebarNavigationProps {
  menus: MainMenu[];
}

defineProps<SidebarNavigationProps>();
</script>

<style scoped></style>
