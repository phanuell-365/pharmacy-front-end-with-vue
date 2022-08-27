<template>
  <ul
    id="accordionSidebar"
    class="list-unstyled ps-0 accordion accordion-flush"
  >
    <MainMenu
      v-for="menu in menus"
      :key="menu.name"
      :active="menu.active"
      :ico="menu.ico"
      :name="menu.name"
      :submenus="menu.submenus"
    />
  </ul>
</template>

<script lang="ts" setup>
import MainMenu from "./MainMenu.vue";

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

interface MainMenuProps {
  // the name of the menu
  name: string;
  // the menu's icon
  ico: string;
  // tell whether the current menu is active
  active: boolean;
  // the menu's submenus
  submenus: Submenu[];
}

interface SidebarMenu {
  menus: MainMenuProps[];
}

defineProps<SidebarMenu>();
</script>

<style scoped></style>
