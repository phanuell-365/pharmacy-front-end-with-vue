<script lang="ts" setup>
const onBeforeEnter = () => {
  console.log("on before enter");
};
</script>

<template>
  <RouterView #="{ Component }">
    <template v-if="Component">
      <Transition mode="in-out" name="router" @before-enter="onBeforeEnter">
        <Suspense timeout="0">
          <!-- main content -->
          <component :is="Component"></component>

          <!-- loading state -->
          <template #fallback> Loading...</template>
        </Suspense>
      </Transition>
    </template>
  </RouterView>
</template>

<style scoped></style>
