<script setup>
import { ref } from 'vue';
import {FilterMatchMode} from "primevue/api";
import transactionService from '~/services/transaction';
import { useUserStore } from '~/store/user';
import Transaction from '@/components/table/transaction.vue'

const { getUser } = useUserStore()
const user = getUser()

definePageMeta({
  layout: "back",
});

const transactions = reactive([])

onMounted( async () => {
  const { data } = await transactionService.getByCompanyId(user.companyId)
  transactions.value = data.value
})

</script>

<template>
  <div class="card">
    <Transaction v-if="transactions.value && transactions.value.length !== 0" :transactions="transactions.value" />
    <div v-else>
      <h1 class="tw-text-4xl tw-font-bold tw-mb-12">There is no transactions yet ..</h1>
    </div>
  </div>
</template>

<style scoped>
.card{
  height: 100%;
}
</style>
