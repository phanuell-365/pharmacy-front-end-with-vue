import { defineStore } from "pinia";
import type {
  NewSupplyDto,
  SupplyDto,
  UpdateSupplyDto,
} from "@/interfaces/supplies";
import { useTokenStore } from "@/stores/utils";
import { SUCCESS } from "@/constants/response";
import { BASE_URL } from "@/constants/url";

const SUPPLIES: SupplyDto[] = [];

export const useSuppliesStore = defineStore({
  id: "supplies",
  state: () => ({
    supplies: [...SUPPLIES],
  }),
  getters: {
    suppliesHasValue: (state) => state.supplies.length > 0,
    getLoadedSupplies: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.suppliesHasValue) return state.supplies;
    },
    getSuppliesAttributes: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.suppliesHasValue)
        return Object.keys(state.supplies[0]).filter((value) => value !== "id");
    },
  },
  actions: {
    getToken: function (): string {
      const tokenStore = useTokenStore();

      return tokenStore.getStoredToken();
    },
    createSupply: async function (payload: NewSupplyDto) {
      const response = await fetch(`${BASE_URL}/supplies`, {
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
          throw new Error(data.message + "! Failed to create the supply!");
        }
        throw new Error(data.message);
      }

      return SUCCESS;
    },
    loadSupplies: async function () {
      const response = await fetch(`${BASE_URL}/supplies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
      });

      const data = await response.json();

      const supplies = data as SupplyDto[];

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to fetch the supplies!");
        }
        throw new Error(data.message);
      }

      this.supplies = [...supplies];
      return supplies;
    },
    loadSupplyById: async function (supplyId: string) {
      const response = await fetch(`${BASE_URL}/supplies/${supplyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(
            data.message + "! Failed to load the supply! Check credentials!"
          );
        }
        throw new Error(data.message);
      }

      return data as SupplyDto;
    },
    updateSupply: async function (supplyId: string, payload: UpdateSupplyDto) {
      const response = await fetch(`${BASE_URL}/supplies/${supplyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to update the supply!");
        }
        throw new Error(data.message);
      }

      return SUCCESS;
    },
  },
});
