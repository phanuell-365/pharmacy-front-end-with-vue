import { defineStore } from "pinia";

export const useTokenStore = defineStore({
  id: "token",
  state: () => ({
    token: null,
    authData: null,
  }),
  getters: {},
  actions: {
    storeTokenToLocalStorage: function (token: string) {
      if (this.getStoredToken()) {
        localStorage.removeItem("token");
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.token = token;

      localStorage.setItem("token", JSON.stringify({ token }));
    },
    storeAuthDataToLocalStorage: function (authData: {
      access_token: string;
      expires_in: string;
      role: string;
    }) {
      const data = JSON.stringify(authData);

      if (this.getStoredAuthData()) {
        localStorage.removeItem("authData");
      }

      localStorage.setItem("authData", data);
    },
    getStoredToken: function (): string {
      const data = localStorage.getItem("token");
      if (!data) {
        return "";
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return JSON.parse(data).token;
    },
    getStoredAuthData: function () {
      const data = localStorage.getItem("authData");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return JSON.parse(data);
    },
    getExpiryDuration: function () {
      const data = localStorage.getItem("authData");

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return JSON.parse(data).expires_in;
    },
    getUsersRole: function () {
      const data = localStorage.getItem("authData");

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return JSON.parse(data).role;
    },
  },
});
