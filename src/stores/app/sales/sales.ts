import { defineStore } from "pinia";
import type { NewSaleDto, SalesDto, UpdateSaleDto } from "@/interfaces/sales";
import { useTokenStore } from "@/stores/utils";
import { SUCCESS } from "@/constants/response";
import { BASE_URL } from "@/constants/url";
import _ from "lodash";

const SALES: SalesDto[] = [];
const SALES_STATUSES: string[] = [];

export const useSalesStore = defineStore({
  id: "sales",
  state: () => ({
    sales: [...SALES],
    salesStatuses: [...SALES_STATUSES],
  }),
  getters: {
    salesHasValue: (state) => state.sales.length > 0,
    salesStatusesHasValue: (state) => state.salesStatuses.length > 0,
    getLoadedSales: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.salesHasValue) return state.sales;
    },
    getSalesAttributes: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.salesHasValue)
        return Object.keys(state.sales[0]).filter((value) => value !== "id");
    },
    getSalesStatuses: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.salesStatusesHasValue) {
        return state.salesStatuses;
      }
    },
  },
  actions: {
    getToken: function () {
      const tokenStore = useTokenStore();

      return tokenStore.getStoredToken();
    },
    createSale: async function (payload: NewSaleDto) {
      const response = await fetch(`${BASE_URL}/sales`, {
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
          throw new Error(data.message + "! Failed to create the sale!");
        }
        throw new Error(data.message);
      }

      return SUCCESS;
    },
    loadSales: async function () {
      const response = await fetch(`${BASE_URL}/sales`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
      });

      const data = await response.json();

      const sales = data as SalesDto[];

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to fetch the sales!");
        }
        throw new Error(data.message);
      }

      this.sales = [...sales];
      return sales;
    },
    loadIssuedSales: async function () {
      const response = await fetch(`${BASE_URL}/sales?status=issued`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
      });

      const data = await response.json();

      const sales = data as SalesDto[];

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to fetch the sales!");
        }
        throw new Error(data.message);
      }
      return sales;
    },
    loadPendingSales: async function () {
      const response = await fetch(`${BASE_URL}/sales?status=pending`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
      });

      const data = await response.json();

      const sales = data as SalesDto[];

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to fetch the sales!");
        }
        throw new Error(data.message);
      }

      return sales;
    },
    loadCancelledSales: async function () {
      const response = await fetch(`${BASE_URL}/sales?status=cancelled`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
      });

      const data = await response.json();

      const sales = data as SalesDto[];

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to fetch the sales!");
        }
        throw new Error(data.message);
      }

      return sales;
    },
    loadSalesStatuses: async function () {
      const response = await fetch(`${BASE_URL}/sales?resource=status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to fetch sale's status !");
        }
        throw new Error(data.message);
      }

      [...(data as string[])].forEach((item) => {
        if (_.has(this.salesStatuses, item))
          this.salesStatuses.push(_.startCase(item));
      });

      return data;
    },
    loadSaleById: async function (saleId: string) {
      const response = await fetch(`${BASE_URL}/sales/${saleId}`, {
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
            data.message + "! Failed to load the sale! Check credentials!"
          );
        }
        throw new Error(data.message);
      }

      return data as SalesDto;
    },
    updateSale: async function (saleId: string, payload: UpdateSaleDto) {
      const response = await fetch(`${BASE_URL}/sales/${saleId}`, {
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
          throw new Error(data.message + "! Failed to update the sale!");
        }
        throw new Error(data.message);
      }

      return SUCCESS;
    },
  },
});
