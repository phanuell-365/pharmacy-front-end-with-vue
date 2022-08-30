import {
  EDIT_SUPPLIERS_ICON,
  NEW_SUPPLIERS_ICON,
  SUPPLIERS_ICON,
} from "@/constants/icons";
import type { Submenu } from "@/stores/menu/interfaces";

export const suppliersSubmenu: Submenu[] = [
  {
    desc: "Create a new supplier",
    ico: NEW_SUPPLIERS_ICON,
    name: "create",
    href: "/suppliers/create",
    routeName: "create-supplier",
    active: false,
  },
  {
    desc: "View all suppliers",
    name: "suppliers",
    href: "/suppliers",
    routeName: "view-suppliers",
    ico: SUPPLIERS_ICON,
    active: false,
  },
  {
    desc: "Update a supplier",
    name: "supplier",
    href: `/suppliers/update`,
    routeName: "update-suppliers",
    ico: EDIT_SUPPLIERS_ICON,
    active: false,
  },
];
