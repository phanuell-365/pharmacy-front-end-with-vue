import { defineStore } from "pinia";
import type {
  NewSupplierDto,
  SupplierDto,
  UpdateSupplierDto,
} from "@/interfaces/suppliers";
import { SUPPLIERS_ATTRIBUTES } from "@/constants/suppliers";
import { useTokenStore } from "@/stores/utils";
import { SUCCESS } from "@/constants/response";

const SUPPLIERS: SupplierDto[] = [];

export const useSuppliersStore = defineStore({
  id: "suppliers",
  state: () => ({
    suppliers: [...SUPPLIERS],
  }),
  getters: {
    suppliersHasValue: (state) => state.suppliers.length > 0,
    getLoadedSuppliers: (state) => state.suppliers,
    getSupplierById: (state) => (supplierId: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.suppliersHasValue) {
        return state.suppliers.find((supplier) => supplier.id === supplierId);
      } else return null;
    },
    getSuppliersAttributes: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.suppliersHasValue) {
        return Object.keys(state.suppliers[0]).filter(
          (value) => value !== "id"
        );
      } else return SUPPLIERS_ATTRIBUTES;
    },
  },
  actions: {
    getToken: function (): string {
      const tokenStore = useTokenStore();

      return tokenStore.getStoredToken();
    },
    createSupplier: async function (payload: NewSupplierDto) {
      const response = await fetch("http://localhost:6900/v1/api/suppliers", {
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
          throw new Error(data.message + "! Failed to create the supplier!");
        }
        throw new Error(data.message);
      }

      return SUCCESS;
    },
    loadSuppliers: async function () {
      const response = await fetch("http://localhost:6900/v1/api/suppliers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
      });

      const data = await response.json();

      const suppliers = data as SupplierDto[];

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to fetch the suppliers!");
        }
        throw new Error(data.message);
      }

      // this.storeUsers(users);

      this.suppliers = [...suppliers];
      return suppliers;
    },
    loadSupplierById: async function (supplierId: string) {
      const response = await fetch(
        `http://localhost:6900/v1/api/suppliers/${supplierId}`,
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
            data.message + "! Failed to load the supplier! Check credentials!"
          );
        }
        throw new Error(data.message);
      }

      this.addSupplierToArray(data as SupplierDto);

      return data as SupplierDto;
    },
    addSupplierToArray: function (supplier: SupplierDto) {
      const existingSupplier = this.suppliers.find(
        (aSupplier) => aSupplier.id === supplier.id
      );

      if (existingSupplier) {
        return;
      }

      this.suppliers.push(supplier);
    },
    updateSupplier: async function (
      supplierId: string,
      payload: UpdateSupplierDto
    ): Promise<boolean> {
      const response = await fetch(
        `http://localhost:6900/v1/api/suppliers/${supplierId}`,
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
          throw new Error(data.message + "! Failed to update the supplier!");
        }
        throw new Error(data.message);
      }

      return SUCCESS;
    },
  },
});
