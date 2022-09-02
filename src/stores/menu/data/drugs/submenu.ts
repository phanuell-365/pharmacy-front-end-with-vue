import type { Submenu } from "@/stores/menu/interfaces";
import { DRUGS_ICON, EDIT_DRUG_ICON, NEW_DRUGS_ICON } from "@/constants/icons";

export const drugsSubmenu: Submenu[] = [
  {
    desc: "Create a new drug",
    name: "create",
    href: "/drugs/create",
    routeName: "create-drug",
    ico: NEW_DRUGS_ICON,
    active: false,
  },
  {
    desc: "View all drugs",
    name: "drugs",
    href: "/drugs",
    routeName: "view-drugs",
    ico: DRUGS_ICON,
    active: false,
  },
  {
    desc: "Update a drug",
    name: "update",
    href: `/drugs/update`,
    routeName: "update-drugs",
    ico: EDIT_DRUG_ICON,
    active: false,
  },
];
