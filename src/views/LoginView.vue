<template>
  <CardLayout>
    <template #heading> Please Login</template>
    <template #body>
      <LoginUser />
    </template>
  </CardLayout>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from "vue";

const CardLayout = defineAsyncComponent(
  () => import("@/layouts/CardLayout.vue")
);

const LoginUser = defineAsyncComponent(
  () => import("@/components/login/LoginUser.vue")
);
</script>

<style scoped></style>
