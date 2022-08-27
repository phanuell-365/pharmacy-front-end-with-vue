import { inventorySubmenu } from "@/stores/menu/data/inventory/submenu";
import { INVENTORY_ICON } from "@/constants/icons";
import type { MainMenu } from "@/stores/menu/interfaces";

export const inventoryMainMenu: MainMenu = {
  name: "inventory",
  ico: INVENTORY_ICON,
  active: false,
  submenus: inventorySubmenu,
};
