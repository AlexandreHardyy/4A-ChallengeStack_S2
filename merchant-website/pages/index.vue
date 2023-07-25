<script setup>
  const {$paygate} = useNuxtApp()
  const nameValue = ref(null)
  const emailValue = ref(null)
  const selectedItems = ref();

  const items = [
    {
      id: 1,
      title: "Voldemort's nose",
      price: 45
    },
    {
      id: 2,
      title: "A platypus",
      price: 86
    },
    {
      id: 3,
      title: "José",
      price: 300
    },
    {
      id: 4,
      title: "Vin Diesel first car",
      price: 1850
    },
    {
      id: 5,
      title: "The crampté",
      price: 1256
    },
  ]

  const formRequest = async (body) => {
    return await $fetch( 'http://localhost:3009/transaction',
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
        $paygate('900493a3-ea8e-401d-b059-e0f5a131892a\t', result.transaction.token)
    }).catch( (error) => {
        console.error('Error sending purchase', error)
    });
  }
</script>

<template>
  <div>
    <Card>
      <template #title> Select items to buy </template>
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
  </div>
</template>