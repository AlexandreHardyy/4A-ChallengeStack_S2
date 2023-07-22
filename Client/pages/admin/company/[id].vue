<script setup>
import {useCustomFetch} from "~/services/use-fetch";

const route = useRoute()

definePageMeta({
  layout: "admin",
});

const user = ref();

onMounted(async () => {
  const res = await useCustomFetch(`user/${route.params.id}`);
  user.value = res.data.value;
});
</script>

<template>
  <div class="card">
    <div v-if="user">
      <h1> {{ user.Company.name }} </h1>
      <h1> address : {{ user.Company.address }} </h1>
      <h1> kbis :  {{ user.Company.name }} </h1>
      <h1> Created at: {{ user.createdAt.split('T')[0] }} </h1>
      <h1> Validated account: {{ user.isValid ? 'yes' : 'false' }} </h1>
      <h1> client name :  {{ user.lastname }} {{ user.firstname }} </h1>
      <h1> client email :  {{ user.lastname }} {{ user.firstname }} </h1>
      <NuxtLink :to="{ path: `/admin/company/transaction/${user.Company.id}`, params: { id: user.Company.id }}" class="btn"> Transactions </NuxtLink>
    </div>
  </div>
</template>

<style scoped></style>
