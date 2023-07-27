<script setup>
import userService from "@/services/user";
import UserForm from "@/components/forms/UserForm.vue"
import CompanyForm from "@/components/forms/CompanyForm.vue"
import companyService from "~/services/company";
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import {useConfirm} from "primevue/useconfirm";
import { useUserStore } from "~/store/user";
import {useToast} from "primevue/usetoast";

definePageMeta({
  layout: "back",
});
const toast = useToast();
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
  const { user } = useUserStore()
  currentUser.value = user
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
    urlDirectionCancel: currentUser.value.Company.urlDirectionCancel,
    url: currentUser.value.Company.url
  })
  if (error.value !== null) {
    return
  }
  currentUser.value.Company.urlDirectionConfirm = data.value[0].urlDirectionConfirm
  currentUser.value.Company.urlDirectionCancel = data.value[0].urlDirectionCancel
  currentUser.value.Company.url = data.value[0].url
}

const copyText = async (value, idIcon) => {
  try {
    await navigator.clipboard.writeText(value);
    document.getElementById(idIcon).classList.remove('pi-copy')
    document.getElementById(idIcon).classList.add('pi-check')
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Copied',
      life: 1000
    })
    setTimeout(() => {
      document.getElementById(idIcon).classList.remove('pi-check')
      document.getElementById(idIcon).classList.add('pi-copy')
    }, 1000)
  } catch($e) {
    console.log($e)
  }
}

//function toggleKey() qui permet de remplacer le texte par des étoiles et vice versa
const toggleKey = (idEye, idInputText, trueText) => {
  if (document.getElementById(idEye).classList.contains('pi-eye')) {
    document.getElementById(idEye).classList.add('pi-eye-slash')
    document.getElementById(idEye).classList.remove('pi-eye')
    document.getElementById(idInputText).value = document.getElementById(idInputText).value.replace(/./g, '*')
  } else if (document.getElementById(idEye).classList.contains('pi-eye-slash')) {
    document.getElementById(idEye).classList.add('pi-eye')
    document.getElementById(idEye).classList.remove('pi-eye-slash')
    document.getElementById(idInputText).value = trueText
  }
}

onMounted(() => {
  toggleKey('apiKeyEye', 'apiKey', currentUser.value.Company.apiToken)
  toggleKey('clientTokenEye', 'clientToken', currentUser.value.Company.clientToken)
})

/*const testEvent = async () => {
  const { user } = useUserStore() // ATTE
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
          <div class="keyAndIcon">
            <span class="p-input-icon-right tw-w-full">
              <InputText id="apiKey" class="tw-w-full" type="text" :value="currentUser.Company.apiToken" disabled />
            </span>
            <i id="apiKeyIcon" class="pi pi-clone tw-cursor-pointer" @click="copyText(currentUser.Company.apiToken, 'apiKeyIcon')" />
            <i id="apiKeyEye" class="pi pi-eye tw-cursor-pointer" @click="toggleKey('apiKeyEye', 'apiKey', currentUser.Company.apiToken)"/>
          </div>
          <div class="tw-mt-3">
            <Button @click="confirmRegenerateToken($event,'apiToken')" icon="pi pi-replay" label="Regenerate Token" />
          </div>
        </div>
        <div>
          <h2 class="tw-mt-10">Public Token</h2>
            <div class="keyAndIcon">
              <span class="p-input-icon-right tw-w-full">
                <InputText id="clientToken" class="tw-w-full" type="text" :value="currentUser.Company.clientToken" disabled />
              </span>
                <i id="clientTokenIcon" class="pi pi-clone tw-cursor-pointer" @click="copyText(currentUser.Company.clientToken, 'clientTokenIcon')" />
                <i id="clientTokenEye" class="pi pi-eye tw-cursor-pointer" @click="toggleKey('clientTokenEye', 'clientToken', currentUser.Company.clientToken)"/>
            </div>
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
        </div>
        <div>
          <h2 class="tw-mt-5">URL of my website</h2>
          <p class="tw-mb-3 danger-info">Care with this, you need to specify it</p>
          <span class="p-input-icon-right tw-w-full">
            <i class="pi pi-clone tw-cursor-pointer" @click="copyText(currentUser.Company.url)" />
            <InputText class="tw-w-full" type="text" v-model="currentUser.Company.url" />
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

.keyAndIcon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
</style>
