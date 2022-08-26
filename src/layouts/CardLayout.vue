<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="card m-auto mt-5 border-light shadow">
          <h5 class="card-header bg-transparent display-6">
            <slot name="heading" />
          </h5>
          <div class="card-body">
            <slot name="body" />
          </div>
          <div class="card-footer bg-transparent">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
