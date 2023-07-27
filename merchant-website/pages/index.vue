<script setup>

  import Transaction from "~/components/table/transaction.vue";

  const {$paygate} = useNuxtApp()
  const nameValue = ref(null)
  const emailValue = ref(null)
  const selectedItems = ref();

  let transactionData = ref();

  const config = useRuntimeConfig();

  const items = [
    {
      id: 1,
      title: "Voldemort's nose 45€",
      price: 45
    },
    {
      id: 2,
      title: "A platypus 86€",
      price: 86
    },
    {
      id: 3,
      title: "José 300€",
      price: 300
    },
    {
      id: 4,
      title: "Bière Essence's first car 1850€",
      price: 1850
    },
    {
      id: 5,
      title: "The crampté 1256€",
      price: 1256
    },
  ]

  const formRequest = async (body) => {
    return await $fetch( `${config.public.apiBaseServerMerchant}/transaction`,
    { 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body,
    })
  }

  const onSubmit = async () => {
    formRequest({
      name: nameValue.value,
      email: emailValue.value,
      amount: selectedItems.value.reduce((acc, curr) => {
        return acc + curr.price
      }, 0)
    }).then( (result) => {
        $paygate(config.public.clientToken, result.transaction.token)
    }).catch( (error) => {
        console.error('Error sending purchase', error)
    });
  }

  onMounted(async () => {
    transactionData.value = await fetch(`${config.public.apiBaseServerMerchant}/transaction/orders`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'GET',
        }).then((res) => res.json()
    ).catch((error) => {
      console.error('Error fetching orders', error)
    });
  });
</script>

<template>
  <div>
    <Card>
      <template #title>Select items to buy</template>
      <template #content>
          <div>
              <label for="name">Name</label>
              <InputText id="name" v-model="nameValue" />
          </div>
          <div>
              <label for="email">Email</label>
              <InputText id="email" v-model="emailValue" />
          </div>
          <div>
            <MultiSelect v-model="selectedItems" :options="items" optionLabel="title" placeholder="Select your items"/>
          </div>
          <Button label="Submit" @click="onSubmit"/>
    </template>
    </Card>

    <Transaction v-if="transactionData" :transactions="transactionData"/>
  </div>
</template>