import { defineStore } from "pinia";
import type {
  InventoryDto,
  NewInventoryDto,
  UpdateInventoryDto,
} from "@/interfaces/inventory";
import { INVENTORY_ATTRIBUTES } from "@/constants/inventory";
import { useTokenStore } from "@/stores/utils";
import { BASE_URL } from "@/constants/url";
import { SUCCESS } from "@/constants/response";
import _ from "lodash";

const INVENTORIES: InventoryDto[] = [];
const ISSUE_UNITS: string[] = [];

export const useInventoryStore = defineStore({
  id: "inventory",
  state: () => ({
    inventories: [...INVENTORIES],
    issueUnits: [...ISSUE_UNITS],
  }),
  getters: {
    inventoriesHasValue: (state) => state.inventories.length > 0,
    issueUnitsHasValue: (state) => state.issueUnits.length > 0,
    getLoadedInventory: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.inventoriesHasValue) return state.inventories;
      else return null;
    },
    getLoadedIssueUnits: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.issueUnitsHasValue) return state.issueUnits;
      else return null;
    },
    getInventoryAttributes: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.inventoriesHasValue)
        return Object.keys(state.inventories[0]).filter(
          (value) => value !== "id"
        );
      else return INVENTORY_ATTRIBUTES;
    },
  },
  actions: {
    getToken: function (): string {
      const tokenStore = useTokenStore();

      return tokenStore.getStoredToken();
    },
    createInventory: async function (payload: NewInventoryDto) {
      const response = await fetch(`${BASE_URL}/inventory`, {
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
          throw new Error(data.message + "! Failed to create the inventory!");
        }
        throw new Error(data.message);
      }

      return SUCCESS;
    },
    loadInventories: async function () {
      const response = await fetch(`${BASE_URL}/inventory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
      });

      const data = await response.json();

      const inventories = data as InventoryDto[];

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to fetch the inventories!");
        }
        throw new Error(data.message);
      }

      this.inventories = [...inventories];

      return inventories;
    },
    loadInventoryById: async function (inventoryId: string) {
      const response = await fetch(`${BASE_URL}/inventory/${inventoryId}`, {
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
            data.message + "! Failed to load the inventory! Check credentials!"
          );
        }
        throw new Error(data.message);
      }

      this.addInventoryToArray(data as InventoryDto);

      return data as InventoryDto;
    },
    addInventoryToArray: function (inventory: InventoryDto) {
      // check if the user already exists
      const existingInventory = this.inventories.find(
        (aInventory) => aInventory.id === inventory.id
      );

      if (existingInventory) {
        return;
      }

      this.inventories.push(inventory);
    },
    loadDrugIssueUnits: async function () {
      const response = await fetch(
        `${BASE_URL}/inventory?resource=issue-units`,
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
          throw new Error(data.message + "! Failed to fetch issue units!");
        }
        throw new Error(data.message);
      }

      [...(data as string[])].forEach((item) => {
        if (_.has(this.issueUnits, item))
          this.issueUnits.push(_.startCase(item));
      });

      return data;
    },
    updateInventory: async function (
      inventoryId: string,
      payload: UpdateInventoryDto
    ) {
      const response = await fetch(`${BASE_URL}/inventory/${inventoryId}`, {
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
          throw new Error(data.message + "! Failed to update the inventory!");
        }
        throw new Error(data.message);
      }

      return SUCCESS;
    },
  },
});
