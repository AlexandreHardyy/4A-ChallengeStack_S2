<script setup>
import { ref } from 'vue';
import {FilterMatchMode} from "primevue/api";
import transactionService from '~/services/transaction';
import { useUserStore } from '~/store/user';
import Transaction from '@/components/table/transaction.vue'

const { user } = useUserStore()

definePageMeta({
  layout: "back",
});

const transactions = ref([])

onMounted( async () => {
  const { data } = await transactionService.get()
  transactions.value = data.value
})

</script>

<template>
  <div class="card">
    <Transaction v-if="transactions && transactions.length !== 0" :transactions="transactions" />
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
