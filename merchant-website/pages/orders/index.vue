<script setup>
import transactionService from '~/services/transaction';
import Transaction from '@/components/table/transaction.vue'

definePageMeta({
  layout: "default",
});

const transactionData = reactive([])

onMounted(async () => {
  // const {data} = await transactionService.getByCompanyId(user.companyId)
  // transactionData.value = data.value
})

</script>

<template>
  <div class="card">
    <Transaction v-if="transactionData.value && transactionData.value.length !== 0" :transactions="transactionData.value"/>
    <div v-else>
      <h1 class="tw-text-4xl tw-fold tw-mb-12">There is no transaction yet...</h1>
    </div>
  </div>
</template>

<style scoped>
.card {
  height: 100%;
}
</style>
