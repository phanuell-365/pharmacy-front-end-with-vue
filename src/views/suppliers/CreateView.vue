<template>
  <section>
    <SidebarLayout>
      <template #sidebar>
        <SidebarNavigation :menus="menuStore.menu" />
      </template>
      <template #heading>Create Patient</template>
      <template #body>
        <CreatePatient />
      </template>
      <template #footer>
        <div class="btn-group">
          <ButtonIcon
            :icon="PATIENTS_ICON"
            color="primary"
            name="users"
            outline
            role="button"
            text="View Patients"
            to="/patients"
          />
        </div>
      </template>
    </SidebarLayout>
  </section>
</template>

<script lang="ts" setup></script>

<style scoped></style>
