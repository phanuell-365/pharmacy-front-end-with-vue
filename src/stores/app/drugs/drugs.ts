import { defineStore } from "pinia";
import type { DrugDto, NewDrugDto, UpdateDrugDto } from "@/interfaces/drugs";
import { DRUG_ATTRIBUTES } from "@/constants/drugs";
import { useTokenStore } from "@/stores/utils";
import { SUCCESS } from "@/constants/response";
import _ from "lodash";

const DRUGS: DrugDto[] = [];
const DOSE_FORMS: string[] = [];
const STRENGTHS: string[] = [];

export const useDrugsStore = defineStore({
  id: "drugs",
  state: () => ({
    drugs: [...DRUGS],
    doseForms: [...DOSE_FORMS],
    strengths: [...STRENGTHS],
  }),
  getters: {
    drugsHasValue: (state) => state.drugs.length > 0,
    drugDoseFormsHasValue: (state) => state.doseForms.length > 0,
    drugStrengthsHasValue: (state) => state.strengths.length > 0,
    getLoadedDrugs: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.drugsHasValue) {
        return state.drugs;
      } else return null;
    },
    getLoadedDrugDoseForms: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.drugDoseFormsHasValue) {
        return state.doseForms;
      } else return null;
    },
    getLoadedDrugStrengths: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.drugStrengthsHasValue) {
        return state.strengths;
      } else return null;
    },
    getDrugsAttributes: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.drugsHasValue)
        return Object.keys(state.drugs[0]).filter((value) => value !== "id");
      else return DRUG_ATTRIBUTES;
    },
  },
  actions: {
    getToken: function (): string {
      const tokenStore = useTokenStore();

      return tokenStore.getStoredToken();
    },
    createDrug: async function (payload: NewDrugDto) {
      const response = await fetch("http://localhost:6900/v1/api/drugs", {
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
          throw new Error(data.message + "! Failed to create the drug!");
        }
        throw new Error(data.message);
      }

      return SUCCESS;
    },
    loadDrugs: async function () {
      const response = await fetch("http://localhost:6900/v1/api/drugs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
      });

      const data = await response.json();

      const drugs = data as DrugDto[];

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to fetch the drugs!");
        }
        throw new Error(data.message);
      }

      // this.storeUsers(users);

      this.drugs = [...drugs];
      return drugs;
    },
    loadDrugById: async function (drugId: string) {
      const response = await fetch(
        `http://localhost:6900/v1/api/drugs/${drugId}`,
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
            data.message + "! Failed to load the drug! Check credentials!"
          );
        }
        throw new Error(data.message);
      }

      this.addDrugToArray(data as DrugDto);

      return data as DrugDto;
    },
    addDrugToArray: function (drug: DrugDto) {
      // check if the user already exists

      const existingDrug = this.drugs.find((aDrug) => aDrug.id === drug.id);

      if (existingDrug) {
        return;
      }

      this.drugs.push(drug);
    },
    loadDrugStrengths: async function () {
      const response = await fetch(
        `http://localhost:6900/v1/api/drugs?resource=strengths`,
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
          throw new Error(data.message + "! Failed to fetch drug's strength!");
        }
        throw new Error(data.message);
      }

      [...(data as string[])].forEach((item) => {
        if (_.has(this.strengths, item)) this.strengths.push(_.startCase(item));
      });

      return data;
    },
    loadDrugDoseForms: async function () {
      const response = await fetch(
        `http://localhost:6900/v1/api/drugs?resource=doseForms`,
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
            data.message + "! Failed to fetch drug's dose forms !"
          );
        }
        throw new Error(data.message);
      }

      [...(data as string[])].forEach((item) => {
        if (_.has(this.doseForms, item)) this.doseForms.push(_.startCase(item));
      });

      return data;
    },
    updateDrug: async function (drugId: string, payload: UpdateDrugDto) {
      const response = await fetch(
        `http://localhost:6900/v1/api/drugs/${drugId}`,
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
          throw new Error(data.message + "! Failed to update the drug!");
        }
        throw new Error(data.message);
      }

      return SUCCESS;
    },
  },
});
