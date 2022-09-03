import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
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
      path: "/users/update",
      name: "update-users",
      component: () => import("../views/users/UpdateView.vue"),
    },
    {
      path: "/users/:id",
      name: "view-user",
      component: () => import("../views/users/id/UserView.vue"),
      props: true,
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
      path: "/drugs/update",
      name: "update-drugs",
      component: () => import("../views/drugs/UpdateView.vue"),
    },
    {
      path: "/drugs/:id",
      name: "view-drug",
      component: () => import("../views/drugs/id/DrugView.vue"),
      props: true,
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
      name: "create-patient",
      component: () => import("../views/patients/CreateView.vue"),
    },
    {
      path: "/patients/update",
      name: "update-patients",
      component: () => import("../views/patients/UpdateView.vue"),
    },
    {
      path: "/patients/:id",
      name: "view-patient",
      component: () => import("../views/patients/id/PatientView.vue"),
      props: true,
    },
    {
      path: "/patients/:id/update",
      name: "update-patient",
      component: () => import("../views/patients/id/UpdatePatientView.vue"),
      props: true,
    },
    {
      path: "/suppliers",
      name: "view-suppliers",
      component: () => import("../views/suppliers/SuppliersView.vue"),
    },
    {
      path: "/suppliers/create",
      name: "create-supplier",
      component: () => import("../views/suppliers/CreateView.vue"),
    },
    {
      path: "/suppliers/update",
      name: "update-suppliers",
      component: () => import("../views/suppliers/UpdateView.vue"),
    },
    {
      path: "/suppliers/:id",
      name: "view-supplier",
      component: () => import("../views/suppliers/id/SupplierView.vue"),
      props: true,
    },
    {
      path: "/suppliers/:id/update",
      name: "update-supplier",
      component: () => import("../views/suppliers/id/UpdateSupplierView.vue"),
      props: true,
    },
    {
      path: "/inventory",
      name: "view-inventories",
      component: () => import("../views/inventory/InventoriesView.vue"),
    },
    {
      path: "/inventory/create",
      name: "create-inventory",
      component: () => import("../views/inventory/CreateView.vue"),
    },
    {
      path: "/inventory/update",
      name: "update-inventories",
      component: () => import("../views/inventory/UpdateView.vue"),
    },
    {
      path: "/inventory/:id",
      name: "view-inventory",
      component: () => import("../views/inventory/id/InventoryView.vue"),
      props: true,
    },
    {
      path: "/inventory/:id/update",
      name: "update-inventory",
      component: () => import("../views/inventory/id/UpdateInventoryView.vue"),
      props: true,
    },
    {
      path: "/orders",
      name: "view-orders",
      component: () => import("../views/orders/OrdersView.vue"),
    },
    {
      path: "/orders/create",
      name: "create-order",
      component: () => import("../views/orders/CreateView.vue"),
    },
    {
      path: "/orders/update",
      name: "update-orders",
      component: () => import("../views/orders/UpdateView.vue"),
    },
    {
      path: "/orders/:id",
      name: "view-order",
      component: () => import("../views/orders/id/OrderView.vue"),
      props: true,
    },
    {
      path: "/orders/:id/update",
      name: "update-order",
      component: () => import("../views/orders/id/UpdateOrderView.vue"),
      props: true,
    },
    {
      path: "/supplies",
      name: "view-supplies",
      component: () => import("../views/supplies/SuppliesView.vue"),
    },
    {
      path: "/supplies/orders",
      name: "supplies-orders",
      component: () => import("../views/supplies/SuppliesOrdersView.vue"),
    },
    {
      path: "/supplies/:orderId/create",
      name: "create-supply",
      component: () => import("../views/supplies/CreateView.vue"),
      props: true,
    },
    {
      path: "/supplies/:id/update",
      name: "update-supply",
      component: () => import("../views/supplies/id/UpdateSupplyView.vue"),
      props: true,
    },
    {
      path: "/sales",
      name: "view-sales",
      component: () => import("../views/sales/SalesView.vue"),
    },
    {
      path: "/sales/create",
      name: "create-sale",
      component: () => import("../views/sales/CreateView.vue"),
    },
    {
      path: "/sales/:id/update",
      name: "update-sale",
      component: () => import("../views/sales/id/UpdateSaleView.vue"),
      props: true,
    },
  ],
});

export default router;
