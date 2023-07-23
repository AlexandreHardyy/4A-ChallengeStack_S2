<script setup>
import {useCustomFetch} from "~/services/use-fetch";
import userService from "~/services/user";
import {useToast} from "primevue/usetoast";

const route = useRoute()
const router = useRouter()
const toasts = useToast();

definePageMeta({
  layout: "admin",
});

const user = ref();

onMounted(async () => {
  const res = await useCustomFetch(`user/${route.params.id}`);
  user.value = res.data.value;
});

const toogleCompany = async (accept) => {
  const { error, data } = await userService.update({ isValid: accept, id:route.params.id })
  if (error.value !== null || !data.value?.id) {
    return
  }
  toasts.add({
    severity: accept ? "success" : "warn",
    summary: "Success",
    detail: `Company ${accept ? 'accepted' : 'disabled'}`,
    life: 3000,
  });
  router.back()
};
</script>

<template>
  <div v-if="user" class="card">
    <div>
      <h1> {{ user.Company.name }} </h1>
      <h1> address : {{ user.Company.address }} </h1>
      <h1> kbis :  {{ user.Company.name }} </h1>
      <h1> Created at: {{ user.createdAt.split('T')[0] }} </h1>
      <h1> Validated account: {{ user.isValid ? 'yes' : 'false' }} </h1>
      <h1> client name :  {{ user.lastname }} {{ user.firstname }} </h1>
      <h1> client email :  {{ user.lastname }} {{ user.firstname }} </h1>
      <NuxtLink :to="{ path: `/admin/company/transaction/${user.Company.id}`, params: { id: user.Company.id }}" class="btn"> Transactions </NuxtLink>
    </div>
    <div class="tw-flex tw-gap-3 tw-mt-5">
      <Button v-if="!user.isValid" @click="toogleCompany(true)" severity="info">Accept company</Button>
      <Button v-else @click="toogleCompany(false)" severity="danger">Disable company</Button>
      <Button @click="router.back()">Back</Button>
    </div>
  </div>
</template>

<style scoped></style>
