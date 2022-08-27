import {
  EDIT_ICON,
  EDIT_INVENTORY_ICON,
  INVENTORY_ICON,
} from "@/constants/icons";
import type { Submenu } from "@/stores/menu/interfaces";
import { UNDEF } from "@/constants/routes";

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
    routeName: "view-inventory",
    ico: EDIT_INVENTORY_ICON,
    active: false,
  },
  {
    desc: "Update a inventory",
    name: "update",
    href: `/inventory/${UNDEF}/update`,
    routeName: "update-inventory",
    ico: EDIT_ICON,
    active: false,
  },
];
