<script setup>
import {useCustomFetch} from "~/services/use-fetch";
definePageMeta({
  layout: "admin",
});

const dialogRef = inject("dialogRef")

const merchants = ref();

onMounted(async () => {
  const res = await useCustomFetch(`company/${dialogRef.value.data.id}`);
  merchants.value = res.data.value;
});

</script>

<template>
  <div v-if="merchants">
    <pre>{{merchants}}</pre>
    <div class="tw-flex tw-gap-3 tw-mt-3">
      <Button>Validate</Button>
      <Button severity="danger">Cancel</Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>