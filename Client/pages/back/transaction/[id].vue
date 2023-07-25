<script setup>
  import Transaction from '@/components/transaction.vue'
  import transactionService from '~/services/transaction';

  const router = useRouter()
  const route = useRoute()

  const transaction = ref();

  definePageMeta({
    layout: "back",
  });

  onMounted(async () => {
    const res = await transactionService.getById(route.params.id)
    transaction.value = res.data.value;
  });
</script>

<template>
  <div>
    <Button class="!tw-mb-4" @click="router.back()">Back</Button>
    <Transaction v-if="transaction" :transaction="transaction"/>
  </div>
</template>