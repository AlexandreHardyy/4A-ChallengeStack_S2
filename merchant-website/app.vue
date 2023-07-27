<template>
  <div>
    <Toast />
    <ConfirmPopup></ConfirmPopup>
    <ConfirmDialog></ConfirmDialog>
    <NuxtPage />
  </div>
</template>
<script setup>
  import Toast from 'primevue/toast';
  import ConfirmPopup from 'primevue/confirmpopup';
  import ConfirmDialog from 'primevue/confirmdialog';
</script>