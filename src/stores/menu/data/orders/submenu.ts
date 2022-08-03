import {
  EDIT_ORDER_ICON,
  NEW_ORDER_ICON,
  ORDERS_ICON,
} from "@/constants/icons";
import type { Submenu } from "@/stores/menu/interfaces";

export const ordersSubmenu: Submenu[] = [
  {
    desc: "Create a new order",
    ico: NEW_ORDER_ICON,
    name: "create",
    href: "/orders/create",
    routeName: "create-order",
    active: false,
  },
  {
    desc: "View all orders",
    name: "orders",
    href: "/orders",
    routeName: "view-orders",
    ico: ORDERS_ICON,
    active: false,
  },
  {
    desc: "Update an order",
    name: "update",
    href: `/orders/update`,
    routeName: "update-orders",
    ico: EDIT_ORDER_ICON,
    active: false,
  },
];
