import type { Submenu } from "@/stores/menu/interfaces";
import { EDIT_USER_ICON, NEW_USER_ICON, USERS_ICON } from "@/constants/icons";
import { UNDEF } from "@/constants/routes";

export const usersSubmenu: Submenu[] = [
  {
    desc: "Create a new user",
    name: "create",
    href: "/users/create",
    routeName: "create-user",
    ico: NEW_USER_ICON,
    active: false,
  },
  {
    desc: "View all users",
    ico: USERS_ICON,
    name: "users",
    href: "/users",
    routeName: "view-users",
    active: false,
  },
  {
    desc: "Update a user",
    ico: EDIT_USER_ICON,
    name: "update",
    href: `/users/${UNDEF}/update`,
    routeName: "update-user",
    active: false,
  },
];
