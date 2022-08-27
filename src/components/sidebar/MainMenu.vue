<template>
  <div class="accordion-item">
    <SubmenuTitle
      :id="`collapse${menuName}`"
      :active="active"
      :icon="ico"
      :name="menuName"
    />
    <div
      :id="`collapse${menuName}`"
      :class="{ show: active }"
      class="accordion-collapse collapse"
      data-bs-parent="#accordionSidebar"
    >
      <div class="list-group list-group-flush">
        <SubMenu
          v-for="submenu in submenus"
          :key="submenu.name"
          :active="submenu.active"
          :description="submenu.desc"
          :href="submenu.href"
          :icon="submenu.ico"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SubmenuTitle from "./SubmenuTitle.vue";
import SubMenu from "./SubMenu.vue";
import * as _ from "lodash";

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

const props = defineProps<MainMenu>();

const menuName = _.startCase(props.name);
</script>

<style scoped></style>
