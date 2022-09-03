import {
  EDIT_SUPPLY_ICON,
  NEW_SUPPLY_ICON,
  SUPPLIES_ICON,
} from "@/constants/icons";
import type { Submenu } from "@/stores/menu/interfaces";
import { UNDEF } from "@/constants/routes";

export const suppliesSubmenu: Submenu[] = [
  {
    desc: "Create a new supply",
    ico: NEW_SUPPLY_ICON,
    name: "create",
    href: "/supplies/orders",
    routeName: "supplies-orders",
    active: false,
  },
  {
    desc: "View all supplies",
    name: "supplies",
    href: "/supplies",
    routeName: "view-supplies",
    ico: SUPPLIES_ICON,
    active: false,
  },
  {
    desc: "Update a supply",
    name: "update",
    href: `/supplies/${UNDEF}/update`,
    routeName: "update-supply",
    ico: EDIT_SUPPLY_ICON,
    active: false,
  },
];
