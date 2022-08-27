import type { MainMenu } from "@/stores/menu/interfaces";
import { SUPPLIES_ICON } from "@/constants/icons";
import { suppliesSubmenu } from "@/stores/menu/data/supplies/submenu";

export const suppliesMainMenu: MainMenu = {
  name: "supplies",
  ico: SUPPLIES_ICON,
  active: false,
  submenus: suppliesSubmenu,
};
