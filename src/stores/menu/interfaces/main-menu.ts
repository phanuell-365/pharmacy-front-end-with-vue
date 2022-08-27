import type { Submenu } from "./submenu";

export interface MainMenu {
  // the name of the menu
  name: string;
  // the menu's icon
  ico: string;
  // tell whether the current menu is active
  active: boolean;
  // the menu's submenus
  submenus: Submenu[];
}
