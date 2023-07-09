<script setup>
    import { ref } from "vue";
    import {Chart} from "chart.js/auto";

    const transactionData = ref()

    const dates = ref([new Date(), new Date()]);

    const chart = ref(null);
    const chartRef = ref(null)
    const selectedMetric = ref('Revenues');

    const revenues = ref();
    const createdTransactions = ref();
    const confirmedTransactions = ref();

    const retrieveRevenues = (transactions) => {
        if (!transactions) { return 0 }
        return transactions.reduce((acc, curr) => {
            if (!curr.Operations.find(operation => operation.status === 'finished')) { return acc }
            return acc + curr.commission
        }, 0)
    }

    const retrieveCreatedTransactions = (transactions) => {
        if (!transactions) { return 0 }
        return transactions.filter(transaction => {
            return transaction.Operations.find(operation => operation.status === 'created')
        }).length
    }

    const retrieveConfirmedTransactions = (transactions) => {
        if (!transactions) { return 0 }
        return transactions.filter(transaction => {
            return transaction.Operations.find(operation => operation.status === 'finished')
        }).length
    }

    const formatteDate = (date) => {
      const formattedDate = new Date(date)
      const year = formattedDate.getFullYear()
      const month = formattedDate.getUTCMonth() + 1
      const day = formattedDate.getDate()
      return `${year}-${month}-${day}`
    }

    const buildDateArray = (dates) => {
      const dateArray = []

      let currentDate = dates[0].getTime()
      const endDate = dates[1].getTime()

      while (currentDate < endDate) {
        dateArray.push({ x:formatteDate(currentDate), y: 0})
        currentDate += 24 * 60 * 60 * 1000
      }

      dateArray.push({ x:formatteDate(endDate), y: 0})
      return dateArray
    }

    const buildChart = (data) => {
      const config = {
        type: 'bar',
        data: {
          datasets: [{
            data
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      }


      if (chartRef.value) {
        chartRef.value.destroy()
      }

      chartRef.value = new Chart(
        chart.value,
        config
      )
    }

    const buildChartRevenues = (transactions) => {
      if (!transactions) { return undefined }
      
      const finishedTransactions = transactions.filter(transaction => transaction.Operations.find(operation => operation.status === 'finished'))

      const data = buildDateArray(dates.value)

      for (const transaction of finishedTransactions) {
        const finishedOperation = transaction.Operations.find(operation => operation.status === 'finished')
        const date = formatteDate(finishedOperation.createdAt)

        const index = data.map(elem => elem.x).indexOf(date)

        if (index > 0) {
          data[index] = {
            ...data[index],
            y: data[index].y + transaction.commission
          }
        }        
      }

      buildChart(data)
    }
    
    const buildChartCreatedTransaction = (transactions) => {
      if (!transactions) { return undefined }

      const data = buildDateArray(dates.value)

      for (const transaction of transactions) {
        const createdOperation = transaction.Operations.find(operation => operation.status === 'created')
        const date = formatteDate(createdOperation.createdAt)

        const index = data.map(elem => elem.x).indexOf(date)

        if (index > 0) {
          data[index] = {
            ...data[index],
            y: data[index].y + 1
          }
        }        
      }

      buildChart(data)
    }

    const buildChartConfirmedTransaction = (transactions) => {
      if (!transactions) { return undefined }

      const finishedTransactions = transactions.filter(transaction => transaction.Operations.find(operation => operation.status === 'finished'))
    
      const data = buildDateArray(dates.value)

      for (const transaction of finishedTransactions) {
        const createdOperation = transaction.Operations.find(operation => operation.status === 'finished')
        const date = formatteDate(createdOperation.createdAt)

        const index = data.map(elem => elem.x).indexOf(date)

        if (index > 0) {
          data[index] = {
            ...data[index],
            y: data[index].y + 1
          }
        }        
      }

      buildChart(data)
    }

    const onDateChange = async (event) => {
        if (!event[0] || !event[1]) { return }
        const { data, error } = await useFetch(`http://localhost:3000/transaction?from=${event[0]}&to=${event[1]}`)
        transactionData.value = data.value
        
        revenues.value = retrieveRevenues(data.value)
        buildChartRevenues(data.value)
        buildDateArray(event)

        createdTransactions.value = retrieveCreatedTransactions(data.value)
        confirmedTransactions.value = retrieveConfirmedTransactions(data.value)
    }

    const onSelectedMetricChange = (metric) => {
      selectedMetric.value = metric

      if (metric === 'Revenues') { buildChartRevenues(transactionData.value) }
      if (metric === 'Created Transaction') { buildChartCreatedTransaction(transactionData.value) }
      if (metric === 'Confirmed Transaction') { buildChartConfirmedTransaction(transactionData.value) }
    }

    definePageMeta({
    layout: "admin",
    });

    onMounted(async () => {
      const { data, error } = await useFetch(`http://localhost:3000/transaction?from=${dates.value[0]}&to=${dates.value[1]}`)
      transactionData.value = data.value

      revenues.value = retrieveRevenues(data.value)
      buildChartRevenues(data.value)

      createdTransactions.value = retrieveCreatedTransactions(data.value)
      confirmedTransactions.value = retrieveConfirmedTransactions(data.value)
    })
</script>

<template>
  <div>
      <Calendar v-model="dates" selectionMode="range" :manualInput="false" showButtonBar @update:modelValue="onDateChange"/>
      <div class="tw-grid tw-grid-cols-3 tw-gap-4">
          <Card @click="onSelectedMetricChange('Revenues')">
              <template #title> Revenues </template>
              <template #content>
                  <p>
                      {{revenues}}
                  </p>
              </template>
          </Card>
          <Card @click="onSelectedMetricChange('Created Transaction')">
              <template #title> Created Transaction </template>
              <template #content>
                  <p>
                      {{createdTransactions}}
                  </p>
              </template>
          </Card>
          <Card @click="onSelectedMetricChange('Confirmed Transaction')">
              <template #title> Confirmed Transaction </template>
              <template #content>
                  <p>
                      {{confirmedTransactions}}
                  </p>
              </template>
          </Card>
      </div>
      <Card class="tw-mt-4">
        <template #title> {{selectedMetric}} {{`${formatteDate(dates[0])} to ${formatteDate(dates[1])}`}}</template>
        <template #content>
          <canvas ref="chart"></canvas>
        </template>
      </Card>
  </div>
</template>
