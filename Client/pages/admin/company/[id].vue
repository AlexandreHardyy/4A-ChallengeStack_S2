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
  <div class="card">
    <div v-if="user">
      <div v-if="user" class="tw-flex tw-gap-3 tw-mb-5">
        <Button v-if="!user.isValid" @click="toogleCompany(true)" severity="info" rounded>Accept company</Button>
        <Button v-else @click="toogleCompany(false)" severity="danger" rounded>Disable company</Button>
        <Button v-tooltip.bottom="'Back'" rounded icon="pi pi-arrow-left" @click="router.back()" />
      </div>
      <div class="tw-flex tw-gap-3 tw-w-full tw-mb-3">
        <div class="tw-flex tw-flex-col tw-gap-1 tw-w-full">
          <label for="username">Company name</label>
          <InputText :value="user.Company.name" disabled/>
        </div>
        <div class="tw-flex tw-flex-col tw-gap-1 tw-w-full">
          <label for="username">Company adress</label>
          <InputText :value="user.Company.address" disabled/>
        </div>
      </div>
      <div class="tw-flex tw-flex-col tw-gap-1 tw-mb-3">
        <label for="username">KBIS</label>
        <InputText :value="user.Company.kbis" disabled/>
      </div>
      <div class="tw-flex tw-flex-col tw-gap-1 tw-mb-3">
        <label for="username">Created at</label>
        <InputText :value="user.Company.createdAt" disabled/>
      </div>
      <div class="tw-flex tw-flex-col tw-gap-1 tw-mb-3">
        <label for="username">is Valid</label>
        <InputText :value="user.isValid ? 'yes' : 'false'" disabled/>
      </div>
      <div class="tw-flex tw-gap-3 tw-w-full tw-mb-3">
        <div class="tw-w-full tw-flex tw-flex-col tw-gap-1">
          <label for="username">Firstname</label>
          <InputText :value="user.firstname" disabled/>
        </div>
        <div class="tw-w-full tw-flex tw-flex-col tw-gap-1">
          <label for="username">Latsname</label>
          <InputText :value="user.lastname" disabled/>
        </div>
      </div>
      <div class="tw-flex tw-flex-col tw-gap-1 tw-mb-3">
        <label for="username">Email</label>
        <InputText :value="user.email" disabled/>
      </div>
      <NuxtLink :to="{ path: `/admin/company/transaction/${user.Company.id}`, params: { id: user.Company.id }}" class="btn"><Button label="Transactions"/></NuxtLink>
    </div>
  </div>
</template>

<style scoped></style>
