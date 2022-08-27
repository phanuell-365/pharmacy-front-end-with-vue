import { patientsSubmenu } from "@/stores/menu/data/patients/submenu";
import { PATIENTS_ICON } from "@/constants/icons";
import type { MainMenu } from "@/stores/menu/interfaces";

export const patientsMainMenu: MainMenu = {
  name: "patients",
  ico: PATIENTS_ICON,
  active: false,
  submenus: patientsSubmenu,
};
