import { defineStore } from "pinia";
import type {
  NewOrderDto,
  OrdersDto,
  UpdateOrderDto,
} from "@/interfaces/orders";
import { ORDERS_ATTRIBUTES } from "@/constants/orders";
import { useTokenStore } from "@/stores/utils";
import { SUCCESS } from "@/constants/response";
import { BASE_URL } from "@/constants/url";
import _ from "lodash";

const ORDERS: OrdersDto[] = [];
const ORDER_STATUS: string[] = [];

export const useOrdersStore = defineStore({
  id: "orders",
  state: () => ({
    orders: [...ORDERS],
    orderStatus: [...ORDER_STATUS],
  }),
  getters: {
    ordersHasValue: (state) => state.orders.length > 0,
    orderStatusHasValue: (state) => state.orderStatus.length > 0,
    getLoadedOrders: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.ordersHasValue) return state.orders;
    },
    getOrdersAttributes: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.ordersHasValue)
        return Object.keys(state.orders[0]).filter((value) => value !== "id");
      else return ORDERS_ATTRIBUTES;
    },
  },
  actions: {
    getToken: function (): string {
      const tokenStore = useTokenStore();

      return tokenStore.getStoredToken();
    },
    createOrder: async function (payload: NewOrderDto) {
      const response = await fetch(`${BASE_URL}/orders`, {
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
          throw new Error(data.message + "! Failed to create the order!");
        }
        throw new Error(data.message);
      }

      return SUCCESS;
    },
    loadOrders: async function () {
      const response = await fetch(`${BASE_URL}/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
      });

      const data = await response.json();

      const orders = data as OrdersDto[];

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to fetch the orders!");
        }
        throw new Error(data.message);
      }

      this.orders = [...orders];
      return orders;
    },
    loadOrderStatuses: async function () {
      const response = await fetch(`${BASE_URL}/orders?resource=status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to fetch order's status !");
        }
        throw new Error(data.message);
      }

      [...(data as string[])].forEach((item) => {
        if (_.has(this.orderStatus, item))
          this.orderStatus.push(_.startCase(item));
      });

      return data;
    },
    loadOrderById: async function (orderId: string): Promise<OrdersDto> {
      const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
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
            data.message + "! Failed to load the order! Check credentials!"
          );
        }
        throw new Error(data.message);
      }

      return data as OrdersDto;
    },
    updateOrder: async function (orderId: string, payload: UpdateOrderDto) {
      const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
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
          throw new Error(data.message + "! Failed to update the order!");
        }
        throw new Error(data.message);
      }

      return SUCCESS;
    },
  },
});
