<script setup>

definePageMeta({
    layout: "sdk",
  });

  const cbName = ref(null)
  const cbNumber = ref(null)
  const expirationDate = ref(null)
  const cvc = ref(null)
  const isLoading = ref(false)

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
        isLoading.value = true
        setTimeout(() => {
          window.parent.postMessage(result.urlDirectionConfirm, '*')
          window.close()
        }, 5000)
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
  <div v-if="!isLoading" class="tw-container tw-mx-auto tw-flex tw-flex-col tw-gap-4 tw-items-center tw-justify-center tw-h-screen">
    <h1>Welcom to paygate</h1>
    <InputText class="tw-w-1/3" v-model="cbName" placeholder="Name"/>
    <InputMask class="tw-w-1/3" id="cbNumber" v-model="cbNumber" mask="9999-9999-9999-9999" placeholder="cbNumber" />
    <InputMask class="tw-w-1/3" id="expirationDate" v-model="expirationDate" mask="99-99" placeholder="Expiration Date" slotChar="mm/yy" />
    <InputMask class="tw-w-1/3" id="cvc" v-model="cvc" mask="999" placeholder="cvc" />
    <div class="tw-flex tw-gap-4 tw-w-1/3">
      <Button style="width: 100%;" label="Submit" @click="onSubmit"/>
      <Button style="width: 100%;" label="Cancel" @click="onCancel"/>
    </div>
  </div>
  <div v-else class="tw-container tw-mx-auto tw-flex tw-flex-col tw-gap-4 tw-items-center tw-justify-center tw-h-screen">
    <h1>Your payment is now being processed. You will be redirected in 5 seconds.</h1>
    <ProgressSpinner />
  </div>
</template>