<template>
  <section>
    <aside class="d-flex flex-column flex-shrink-0 p-3 bg-white">
      <slot name="sidebar" />
    </aside>
    <main>
      <CardLayout name="card">
        <template #heading>
          <slot name="heading" />
        </template>
        <template #body>
          <slot name="body" />
        </template>
        <template #footer>
          <slot name="footer" />
        </template>
      </CardLayout>
    </main>
  </section>
</template>

<script lang="ts" setup>
import CardLayout from "./CardLayout";
</script>

<style scoped>
aside {
  width: 280px;
  height: 100%;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
}

main {
  height: 100%;
  margin-left: 280px;
}
</style>
