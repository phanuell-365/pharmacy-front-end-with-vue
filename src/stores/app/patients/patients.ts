import { defineStore } from "pinia";
import type {
  NewPatientDto,
  PatientDto,
  UpdatePatientDto,
} from "@/interfaces/patients";
import { PATIENTS_ATTRIBUTES } from "@/constants/patients";
import { useTokenStore } from "@/stores/utils";
import { SUCCESS } from "@/constants/response";

const PATIENTS: PatientDto[] = [];

export const usePatientsStore = defineStore({
  id: "patients",
  state: () => ({
    patients: [...PATIENTS],
  }),
  getters: {
    patientsHasValue: (state) => state.patients.length > 0,
    getPatientById: (state) => (patientId: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.patientsHasValue) {
        return state.patients.find((patient) => patient.id === patientId);
      }
    },
    getPatientsAttributes: (state) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (state.patientsHasValue) {
        return Object.keys(state.patients[0]).filter((value) => value !== "id");
      } else {
        return PATIENTS_ATTRIBUTES;
      }
    },
  },
  actions: {
    getToken: function (): string {
      const tokenStore = useTokenStore();

      return tokenStore.getStoredToken();
    },
    createPatient: async function (payload: NewPatientDto) {
      const response = await fetch("http://localhost:6900/v1/api/patients", {
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
          throw new Error(data.message + "! Failed to create the patient!");
        }
        throw new Error(data.message);
      }

      return SUCCESS;
    },
    loadPatients: async function () {
      const response = await fetch("http://localhost:6900/v1/api/patients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken(),
        },
      });

      const data = await response.json();

      const patients = data as PatientDto[];

      if (!response.ok) {
        if (data.message === "Unauthorized") {
          throw new Error(data.message + "! Failed to fetch the patients!");
        }
        throw new Error(data.message);
      }

      // this.storeUsers(users);

      this.patients = [...patients];
      return patients;
    },
    loadPatientById: async function (patientId: string) {
      const response = await fetch(
        `http://localhost:6900/v1/api/patients/${patientId}`,
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
            data.message + "! Failed to load the patient! Check credentials!"
          );
        }
        throw new Error(data.message);
      }

      this.addPatientToArray(data as PatientDto);

      return data as PatientDto;
    },
    addPatientToArray(patient: PatientDto) {
      const existingPatient = this.patients.find(
        (aPatient) => aPatient.id === patient.id
      );

      if (existingPatient) {
        return;
      }

      this.patients.push(patient);
    },
    updatePatient: async function (
      patientId: string,
      payload: UpdatePatientDto
    ) {
      const response = await fetch(
        `http://localhost:6900/v1/api/patients/${patientId}`,
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
          throw new Error(data.message + "! Failed to update the patient!");
        }
        throw new Error(data.message);
      }

      if (response.status === 200) {
        return SUCCESS;
      }
    },
  },
});
