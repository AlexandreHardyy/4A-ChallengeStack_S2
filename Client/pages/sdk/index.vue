<script setup>

definePageMeta({
    layout: "sdk",
  });

  const cbName = ref(null)
  const cbNumber = ref(null)
  const expirationDate = ref(null)
  const cvc = ref(null)

  const route = useRoute()

  const clientToken = route.query.clientToken
  const transactionToken = route.query.transactionToken

  const formRequest = async (type, body) => {
    return await $fetch( `http://localhost:3000/transaction/${transactionToken}/${type}`, 
    { 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body,
    })
  }

  const onSubmit = () => {
    formRequest('confirm', {
      cbName: cbName.value,
      cbNumber: cbNumber.value,
      expirationDate: expirationDate.value,
      cvc: cvc.value,
      clientToken
    }).then( (result) => {
      if (result) {
        window.parent.postMessage(result.urlDirectionConfirm, '*')
        window.close()
      }
    }).catch( (error) => {
      console.error('Contact form could not be send', error)
    });
  }

  const onCancel = () => {
    formRequest('cancel', {
      clientToken
    }).then( (result) => {
      if (result) {
        window.parent.postMessage(result.urlDirectionCancel, '*')
        window.close()
      }
    }).catch( (error) => {
      console.error('Contact form could not be send', error)
    });
  }

</script>

<template>
  <div>
    <h1>Welcom to paygate</h1>
    <InputText v-model="cbName"/>
    <InputMask id="cbNumber" v-model="cbNumber" mask="9999-9999-9999-9999" placeholder="cbNumber" />
    <InputMask id="expirationDate" v-model="expirationDate" mask="99-99" slotChar="mm/yy" />
    <InputMask id="cvc" v-model="cvc" mask="999" placeholder="cvc" />
    <Button label="Submit" @click="onSubmit"/>
    <Button label="Cancel" @click="onCancel"/>
  </div>
</template>