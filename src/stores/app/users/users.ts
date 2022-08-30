import { defineStore } from "pinia";
import { useTokenStore } from "@/stores/utils";
import type { NewUserDto, UpdateUserDto, UserDto } from "@/interfaces";
import _ from "lodash";
import { USERS_ATTRIBUTES } from "@/constants/users";
import { SUCCESS } from "@/constants/response";

const USERS: UserDto[] = [];
const USERSROLES: string[] = [];

export const useUsersStore = defineStore({
  id: "users",
  state: () => ({
    users: [...USERS],
    usersRoles: [...USERSROLES],
  }),
  getters: {
    usersHasValue: (state) => state.users.length > 0,
    getLoadedUsers: (state) => state.users,
    getUserById: (state) => (userId: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.usersHasValue) {
        return state.users.find((user) => user.id === userId);
      } else return null;
    },
    getLoadedUsersRoles: (state) => {
      if (state.usersRoles.length > 0) {
        return state.usersRoles;
      }
    },
    getUsersAttributes: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.usersHasValue) {
        return Object.keys(state.users[0]).filter((value) => value !== "id");
      } else {
        return USERS_ATTRIBUTES;
      }
    },
  },
  actions: {
    getToken: function (): string {
      const tokenStore = useTokenStore();

      return tokenStore.getStoredToken();
    },
    createUser: async function (payload: NewUserDto): Promise<boolean> {
      const response = await fetch("http://localhost:6900/v1/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to create the user!");
        }
        throw new Error(data.message);
      }

      return SUCCESS;
    },
    loadUsers: async function (): Promise<UserDto[]> {
      const response = await fetch("http://localhost:6900/v1/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
      });

      const data = await response.json();

      const users = data as UserDto[];

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to fetch the users!");
        }
        throw new Error(data.message);
      }

      // this.storeUsers(users);

      this.users = [...users];
      return users;
    },
    // storeUsers: function (users: UserDto[]) {
    // },
    // getUsersAttributes: async function () {
    //   const users = await this.loadUsers();
    //   return Object.keys(users[0]);
    // },
    loadUserById: async function (userId: string) {
      const response = await fetch(
        `http://localhost:6900/v1/api/users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.getToken(),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(
            data.message + "! Failed to load the user! Check credentials!"
          );
        }
        throw new Error(data.message);
      }

      this.addUserToArray(data as UserDto);

      return data as UserDto;
    },
    addUserToArray: function (user: UserDto) {
      // check if the user already exists

      const existingUser = this.users.find((aUser) => aUser.id === user.id);

      if (existingUser) {
        return;
      }

      this.users.push(user);
    },
    loadUsersRoles: async function () {
      const response = await fetch(
        `http://localhost:6900/v1/api/users?resource=roles`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.getToken(),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to fetch user's roles!");
        }
        throw new Error(data.message);
      }

      [...(data as string[])].forEach((item) => {
        if (_.has(this.usersRoles, item))
          this.usersRoles.push(_.startCase(item));
      });

      return data;
    },
    updateUser: async function (userId: string, payload: UpdateUserDto) {
      const response = await fetch(
        `http://localhost:6900/v1/api/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.getToken(),
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to update the user!");
        }
        throw new Error(data.message);
      }

      if (response.status === 200) {
        return SUCCESS;
      }
    },
  },
});
