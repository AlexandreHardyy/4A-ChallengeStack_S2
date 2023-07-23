<script setup>

import userService from "@/services/user";
import UserForm from "@/components/forms/UserForm.vue"
import CompanyForm from "@/components/forms/CompanyForm.vue"
import companyService from "~/services/company";

definePageMeta({
  layout: "back",
});

const currentUser = ref({})

onBeforeMount(async () => {
  const { data } = await userService.getCurrentUser()
  if (data.value) {
    currentUser.value = data.value
  }
})

const userSubmit = async (values) => {
  const { error, data } = await userService.update({ ...values, id: currentUser.value.id })
    if (error.value !== null || !data.value?.id) {
        return
    }
}

const companySubmit = async (values) => {
    const { error, data } = await companyService.update({ ...values, id: currentUser.value.companyId })
    if (error.value !== null || !data.value?.id) {
        return
    }
}

const regenerateToken = async () => {
  const { error, data } = await companyService.regenerateToken(currentUser.value.companyId)
  if (error.value !== null) {
    return
  }
  currentUser.value.Company.apiToken = data.value[0].apiToken
}

const copyText = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
    alert('Copied');
  } catch($e) {
    alert('Cannot copy');
  }
}

</script>

<template>
  <div>
    <TabView v-if="currentUser.id">
      <TabPanel header="User">
        <div class="tw-flex justify-between tw-gap-10">
          <UserForm @submit="userSubmit" :initUser="currentUser" />
          <CompanyForm @submit="companySubmit" :company="currentUser.Company" />
        </div>
      </TabPanel>
      <TabPanel header="API keys">
        <p class="tw-mb-3 danger-info">This is your private key. Keep it secret and don't share it with anyone</p>
        <span class="p-input-icon-right tw-w-full">
          <i class="pi pi-clone tw-cursor-pointer" @click="copyText(currentUser.Company.apiToken)" />
          <InputText class="tw-w-full" type="text" :value="currentUser.Company.apiToken" disabled />
        </span>
        <div class="tw-mt-3">
          <Button @click="regenerateToken" icon="pi pi-replay" label="Regenerate Token" />
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>

<style scoped>

.danger-info {
  background-color: #ff9b9b;
  font-size: 12px;
  margin-top: 5px;
  border: 1px solid #ff4c4e;
  color: black;
  padding: 5px;
  border-radius: 5px;
}

</style>
