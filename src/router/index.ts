import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/users",
      name: "view-users",
      component: () => import("../views/users/UsersView.vue"),
    },
    {
      path: "/users/create",
      name: "create-user",
      component: () => import("../views/users/CreateView.vue"),
    },
    {
      path: "/users/:id/update",
      name: "update-user",
      component: () => import("../views/users/id/UpdateUserView.vue"),
      props: true,
    },
    {
      path: "/drugs",
      name: "view-drugs",
      component: () => import("../views/drugs/DrugsView.vue"),
    },
    {
      path: "/drugs/create",
      name: "create-drug",
      component: () => import("../views/drugs/CreateView.vue"),
    },
    {
      path: "/drugs/:id/update",
      name: "update-drug",
      component: () => import("../views/drugs/id/UpdateDrugView.vue"),
      props: true,
    },
    {
      path: "/patients",
      name: "view-patients",
      component: () => import("../views/patients/PatientsView.vue"),
    },
    {
      path: "/patients/create",
      name: "create-drug",
      component: () => import("../views/patients/CreateView.vue"),
    },
    {
      path: "/patients/:id/update",
      name: "update-drug",
      component: () => import("../views/patients/id/UpdatePatientView.vue"),
      props: true,
    },
  ],
});

export default router;
