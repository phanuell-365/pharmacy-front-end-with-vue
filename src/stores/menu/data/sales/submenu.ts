import { EDIT_SALE_ICON, NEW_SALES_ICON, SALES_ICON } from "@/constants/icons";
import type { Submenu } from "@/stores/menu/interfaces";
import { UNDEF } from "@/constants/routes";

export const salesSubmenu: Submenu[] = [
  {
    desc: "Create a new sale",
    ico: NEW_SALES_ICON,
    name: "create",
    href: "/sales/create",
    routeName: "create-sale",
    active: false,
  },
  {
    desc: "View all sales",
    name: "sales",
    href: "/sales",
    routeName: "view-sales",
    ico: SALES_ICON,
    active: false,
  },
  {
    desc: "Update a sale",
    name: "update",
    href: `/sales/${UNDEF}/update`,
    routeName: "update-sale",
    ico: EDIT_SALE_ICON,
    active: false,
  },
];
