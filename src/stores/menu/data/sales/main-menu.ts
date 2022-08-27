import type { MainMenu } from "@/stores/menu/interfaces";
import { SALES_ICON } from "@/constants/icons";
import { salesSubmenu } from "@/stores/menu/data/sales/submenu";

export const salesMainMenu: MainMenu = {
  name: "sales",
  ico: SALES_ICON,
  active: false,
  submenus: salesSubmenu,
};
