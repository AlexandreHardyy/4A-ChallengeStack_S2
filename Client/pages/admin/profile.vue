<script setup>

import userService from "@/services/user";
import UserForm from "@/components/forms/UserForm.vue"
import { useUserStore } from "~/store/user";


definePageMeta({
  layout: "admin",
});

const currentUser = ref({})
const formMessage = ref(null)

onBeforeMount(async () => {
  const { user } = useUserStore()
  currentUser.value = user
})

const updateUser = async (values) => {
  formMessage.value = null
  const { error, data } = await userService.update({ ...values, id: currentUser.value.id })
    if (error.value !== null || !data.value?.id) {
        formMessage.value = { val: "email already used !", type: "err"}
        return
    }
    formMessage.value = { val: "Profile updated !" }
}

const addUser = async (values) => {
  formMessage.value = null
  const { error, data } = await userService.create(values)
    if (error.value !== null || !data.value?.id) {
        formMessage.value = { val: "email already used !", type: "err"}
        return
    }
    formMessage.value = { val: "User admin added !" } 
}

</script>

<template>
  <div>
    <TabView v-if="currentUser.id" @tab-change="formMessage = null">
      <TabPanel header="Profile">
        <div class="tw-flex justify-between tw-gap-10">
          <UserForm @submit="updateUser" :initUser="currentUser" :formMessage="formMessage" />
        </div>
      </TabPanel>
      <TabPanel header="Add User">
        <UserForm @submit="addUser" title="Add Admin User" :formMessage="formMessage" />
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
