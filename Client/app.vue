<script setup>
import ConfirmPopup from 'primevue/confirmpopup';
import Toast from 'primevue/toast';
import DynamicDialog from 'primevue/dynamicdialog';
</script>

<template>
  <div>
    <Toast></Toast>
    <ConfirmPopup></ConfirmPopup>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
    <DynamicDialog />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: var(--font-family);
}

body {
  color: theme("colors.text");
  background-color: theme("colors.background");
}

ul {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}

:deep(.p-password-input) {
  width: 100%;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
</style>
