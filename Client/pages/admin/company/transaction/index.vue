<script setup>
import transactionService from '~/services/transaction';
import Transaction from '@/components/table/transaction.vue'

const route = useRoute()

definePageMeta({
  layout: "admin",
});

const transactions = reactive([])

onMounted( async () => {
  const { data } = await transactionService.get({companyId: route.query.companyId})
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
