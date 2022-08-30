import type { Submenu } from "@/stores/menu/interfaces";
import {
  EDIT_USER_ICON,
  NEW_USER_ICON,
  PATIENTS_ICON,
} from "@/constants/icons";

export const patientsSubmenu: Submenu[] = [
  {
    desc: "Create a new patient",
    ico: NEW_USER_ICON,
    name: "create",
    href: "/patients/create",
    routeName: "create-patient",
    active: false,
  },
  {
    desc: "View all patients",
    name: "patients",
    href: "/patients",
    routeName: "view-patients",
    ico: PATIENTS_ICON,
    active: false,
  },
  {
    desc: "Update a patient",
    name: "update",
    href: `/patients/update`,
    routeName: "update-patients",
    ico: EDIT_USER_ICON,
    active: false,
  },
];
