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

</script>

<template>
  <div v-if="currentUser.id" class="tw-flex justify-between tw-gap-10">     
    <UserForm @submit="userSubmit" :initUser="currentUser" />
    <CompanyForm @submit="companySubmit" :company="currentUser.Company" />
  </div>
</template>

<style scoped>
</style>
