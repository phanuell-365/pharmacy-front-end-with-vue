import type { MainMenu } from "@/stores/menu/interfaces";
import { SUPPLIERS_ICON } from "@/constants/icons";
import { suppliersSubmenu } from "@/stores/menu/data/suppliers/submenu";

export const suppliersMainMenu: MainMenu = {
  name: "suppliers",
  ico: SUPPLIERS_ICON,
  active: false,
  submenus: suppliersSubmenu,
};
