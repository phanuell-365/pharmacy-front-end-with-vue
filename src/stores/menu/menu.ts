import { defineStore } from "pinia";
import {
  drugsMainMenu,
  inventoryMainMenu,
  ordersMainMenu,
  patientsMainMenu,
  suppliersMainMenu,
  suppliesMainMenu,
  usersMainMenu,
} from "@/stores/menu/data";

export const useMenuStore = defineStore({
  id: "menu",
  state: () => ({
    menu: [
      usersMainMenu,
      drugsMainMenu,
      patientsMainMenu,
      suppliersMainMenu,
      inventoryMainMenu,
      ordersMainMenu,
      suppliesMainMenu,
    ],
  }),
  getters: {
    getActiveMenu: (state) => state.menu,
  },
  actions: {
    /**
     * @description Activates its main menu and itself
     * @param menuName
     * @param subMenuName provide the submenu's name or it's route name
     */
    activateSubMenu: function (menuName: string, subMenuName: string) {
      // deactivate all the menus
      this.menu.forEach((aMenu) => {
        aMenu.active = false;
        aMenu.submenus.forEach((aSubMenu) => {
          aSubMenu.active = false;
        });
      });

      // get the requested menu
      const reqMenu = this.menu.find((aMenu) => aMenu.name === menuName);

      // now activate the desired menu
      if (reqMenu) {
        reqMenu.active = true;

        // get the requested submenu
        const reqSubmenu = reqMenu.submenus.find(
          (aSubMenu) => aSubMenu.name === subMenuName
        );

        // now activate the desired menu
        if (reqSubmenu) {
          reqSubmenu.active = true;
        } else if (!reqSubmenu) {
          // else find the submenu using its route name
          const reqSubmenuByRouteName = reqMenu.submenus.find(
            (aSubMenu) => aSubMenu.routeName === subMenuName
          );

          if (reqSubmenuByRouteName) reqSubmenuByRouteName.active = true;
        }
      }
    },
  },
});
