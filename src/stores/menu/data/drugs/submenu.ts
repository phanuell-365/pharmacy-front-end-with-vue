import type { Submenu } from "@/stores/menu/interfaces";
import { DRUGS_ICON, EDIT_DRUG_ICON, NEW_DRUGS_ICON } from "@/constants/icons";
import { UNDEF } from "@/constants/routes";

export const drugsSubmenu: Submenu[] = [
  {
    desc: "Create a new drugs",
    name: "create",
    href: "/drugs/create",
    routeName: "create-drugs",
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
    desc: "Update a drugs",
    name: "update",
    href: `/drugs/${UNDEF}/update`,
    routeName: "update-drugs",
    ico: EDIT_DRUG_ICON,
    active: false,
  },
];
