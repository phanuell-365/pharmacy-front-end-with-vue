import type { MainMenu } from "@/stores/menu/interfaces";
import { USERS_ICON } from "@/constants/icons";
import { usersSubmenu } from "@/stores/menu/data/users/submenu";

export const usersMainMenu: MainMenu = {
  name: "users",
  ico: USERS_ICON,
  active: false,
  submenus: usersSubmenu,
};
