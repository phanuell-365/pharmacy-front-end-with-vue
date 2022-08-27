import type { MainMenu } from "@/stores/menu/interfaces";
import { DRUGS_ICON } from "@/constants/icons";
import { drugsSubmenu } from "@/stores/menu/data/drugs/submenu";

export const drugsMainMenu: MainMenu = {
  name: "drugs",
  ico: DRUGS_ICON,
  active: false,
  submenus: drugsSubmenu,
};
