import { ORDERS_ICON } from "@/constants/icons";
import { ordersSubmenu } from "@/stores/menu/data/orders/submenu";
import type { MainMenu } from "@/stores/menu/interfaces";

export const ordersMainMenu: MainMenu = {
  name: "orders",
  ico: ORDERS_ICON,
  active: false,
  submenus: ordersSubmenu,
};
