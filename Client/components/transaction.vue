<script setup>
  const { transaction } = defineProps(['transaction'])

  const scrollableTabs = transaction.operations.map(operation => {
    return {
      title: `operation id: ${operation.id}`,
      content: operation
    }
  })

  const currency = {
    'EUR': '€',
    'USD': '$',
    'JPY': '¥'
  }

</script>

<template>
  <div class="tw-container tw-mx-auto tw-flex tw-flex-col tw-gap-4">
    <Card>
        <template #title>Token: {{ transaction.token }} </template>
        <template #content>
          <p>Amount: {{ transaction.amount }} {{ currency[transaction.currency] }}</p>
          <p>Status: {{ transaction.status }}</p>
          <p>Customer name: {{ transaction.name }}</p>
          <p>Customer email: {{ transaction.email }}</p>
          <p>Created At: {{ new Date(transaction.createdAt).toLocaleString() }}</p>
        </template>
    </Card>
    <Card>
      <template #title>Operations:</template>
      <template #content>
        <TabView :scrollable="true">
          <TabPanel v-for="tab in scrollableTabs" :key="tab.title" :header="tab.title">
            <p>Type: {{ tab.content.type}}</p>
            <p>Status: {{ tab.content.status}}</p>
            <p>Amount: {{ tab.content.finalAmount}}</p>
            <Timeline :value="tab.content.operationHistory" >
              <template #opposite="slotProps">
                    <small class="p-text-secondary">{{new Date(slotProps.item.date).toLocaleString()}}</small>
              </template>
              <template #content="slotProps">
                    {{slotProps.item.status}}
                </template> 
            </Timeline>
          </TabPanel>
        </TabView>
      </template>
    </Card>
  </div>

</template>