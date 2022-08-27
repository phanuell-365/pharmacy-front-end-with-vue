import {
  EDIT_SUPPLIERS_ICON,
  NEW_SUPPLIERS_ICON,
  SUPPLIERS_ICON,
} from "@/constants/icons";
import type { Submenu } from "@/stores/menu/interfaces";
import { UNDEF } from "@/constants/routes";

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
    desc: "Update a suppliers",
    name: "supplier",
    href: `/suppliers/${UNDEF}/update`,
    routeName: "update-suppliers",
    ico: EDIT_SUPPLIERS_ICON,
    active: false,
  },
];
