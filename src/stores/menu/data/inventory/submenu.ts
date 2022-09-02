import {
  EDIT_ICON,
  EDIT_INVENTORY_ICON,
  INVENTORY_ICON,
} from "@/constants/icons";
import type { Submenu } from "@/stores/menu/interfaces";

export const inventorySubmenu: Submenu[] = [
  {
    desc: "Create a new inventory",
    ico: INVENTORY_ICON,
    name: "create",
    href: "/inventory/create",
    routeName: "create-inventory",
    active: false,
  },
  {
    desc: "View all inventory",
    name: "inventory",
    href: "/inventory",
    routeName: "view-inventories",
    ico: EDIT_INVENTORY_ICON,
    active: false,
  },
  {
    desc: "Update an inventory",
    name: "update",
    href: `/inventory/update`,
    routeName: "update-inventories",
    ico: EDIT_ICON,
    active: false,
  },
];
