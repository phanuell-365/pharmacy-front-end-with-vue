import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/css/bootstrap.min.css";
import "./assets/js/bootstrap.bundle.min";
import "./assets/css/all.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
