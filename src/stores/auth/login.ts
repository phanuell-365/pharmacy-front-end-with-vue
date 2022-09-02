import { defineStore } from "pinia";
import { useTokenStore } from "@/stores/utils";
import type { AuthDto } from "@/interfaces/auth";
import { SUCCESS } from "@/constants/response";

export const useLoginStore = defineStore({
  id: "login",
  state: () => ({
    token: null,
    authData: null,
    authDuration: String(),
  }),
  getters: {},
  actions: {
    login: async function (payload: AuthDto) {
      const response = await fetch("http://localhost:6900/v1/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      this.storeAuthData({
        access_token: data.access_token,
        expires_in: data.expires_in,
        role: data.role,
      });

      const date = Date.now();

      const newDate = new Date(date).setHours(
        new Date(date).getHours() + Number.parseInt(data.expires_in)
      );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.authDuration = new Date(newDate);
      this.storeToken(data.access_token);

      return SUCCESS;
    },
    storeToken: function (token: string) {
      const tokenStore = useTokenStore();

      tokenStore.storeTokenToLocalStorage(token);
    },
    storeAuthData: function (authData: {
      access_token: string;
      expires_in: string;
      role: string;
    }) {
      const tokenStore = useTokenStore();

      tokenStore.storeAuthDataToLocalStorage(authData);
    },
  },
});
