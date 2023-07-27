<script setup>

import userService from "@/services/user";
import UserForm from "@/components/forms/UserForm.vue"
import CompanyForm from "@/components/forms/CompanyForm.vue"
import companyService from "~/services/company";
import {useUserStore} from "~/store/user"
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import {useConfirm} from "primevue/useconfirm";

definePageMeta({
  layout: "back",
});
const confirm = useConfirm();
const currentUser = ref({})

const confirmRegenerateToken = (event, type) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      regenerateToken(type)
    },
    reject: () => {

    }
  });
};

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

const regenerateToken = async (name) => {
  const { error, data } = await companyService.regenerateToken(currentUser.value.companyId, name)
  if (error.value !== null) {
    return
  }
  currentUser.value.Company.apiToken = data.value[0].apiToken
  currentUser.value.Company.clientToken = data.value[0].clientToken
}

const changeUrl = async ($event) => {
  const { error, data } = await companyService.update({
    id: currentUser.value.companyId,
    urlDirectionConfirm: currentUser.value.Company.urlDirectionConfirm,
    urlDirectionCancel: currentUser.value.Company.urlDirectionCancel
  })
  if (error.value !== null) {
    return
  }
  currentUser.value.Company.urlDirectionConfirm = data.value[0].urlDirectionConfirm
  currentUser.value.Company.urlDirectionCancel = data.value[0].urlDirectionCancel
}

const copyText = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
    alert('Copied');
  } catch($e) {
    alert('Cannot copy');
  }
}

/*const testEvent = async () => {
  const { getUser } = useUserStore()
  const user = getUser()
  const sse = new EventSourcePolyfill("http://localhost:3000/event/subscribe", {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  sse.onmessage = (e) => {
    console.log(e);
  }

  sse.addEventListener("transaction-created", (e) => {
    console.log(e);
  });
}*/

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
        <div>
          <h2>Private Token</h2>
          <p class="tw-mb-3 danger-info">This is your private key. Keep it secret and don't share it with anyone</p>
          <span class="p-input-icon-right tw-w-full">
            <i class="pi pi-clone tw-cursor-pointer" @click="copyText(currentUser.Company.apiToken)" />
            <InputText class="tw-w-full" type="text" :value="currentUser.Company.apiToken" disabled />
          </span>
          <div class="tw-mt-3">
            <Button @click="confirmRegenerateToken($event,'apiToken')" icon="pi pi-replay" label="Regenerate Token" />
          </div>
        </div>
        <div>
          <h2 class="tw-mt-10">Public Token</h2>
          <span class="p-input-icon-right tw-w-full">
            <i class="pi pi-clone tw-cursor-pointer" @click="copyText(currentUser.Company.clientToken)" />
            <InputText class="tw-w-full" type="text" :value="currentUser.Company.clientToken" disabled />
          </span>
          <div class="tw-mt-3">
            <Button @click="confirmRegenerateToken($event,'clientToken')" icon="pi pi-replay" label="Regenerate Token" />
          </div>
        </div>
      </TabPanel>
      <TabPanel header="URL">
        <div>
          <h2>URL confirm</h2>
          <span class="p-input-icon-right tw-w-full">
            <i class="pi pi-clone tw-cursor-pointer" @click="copyText(currentUser.Company.urlDirectionConfirm)" />
            <InputText class="tw-w-full" type="text" v-model="currentUser.Company.urlDirectionConfirm" />
          </span>
        </div>
        <div>
          <h2 class="tw-mt-5">URL cancel</h2>
          <span class="p-input-icon-right tw-w-full">
            <i class="pi pi-clone tw-cursor-pointer" @click="copyText(currentUser.Company.urlDirectionCancel)" />
            <InputText class="tw-w-full" type="text" v-model="currentUser.Company.urlDirectionCancel" />
          </span>
          <div class="tw-mt-8">
            <Button @click="changeUrl" icon="pi pi-save" label="Save" />
          </div>
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
