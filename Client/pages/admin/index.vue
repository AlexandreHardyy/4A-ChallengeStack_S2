<script setup>
    import { ref } from "vue";
    import {Chart} from "chart.js/auto";

    import transactionService from '~/services/transaction';

    const transactionData = ref()

    const dates = ref([new Date(), new Date()]);

    const chart = ref(null);
    const chartRef = ref(null)
    const selectedMetric = ref('Revenues');

    const revenues = ref();
    const createdTransactions = ref();
    const processingTransactions = ref();
    const refundTransactions = ref();

    const retrieveRevenues = (transactions) => {
        if (!transactions) { return 0 }
        return transactions.reduce((acc, curr) => {
            if (curr.status !== 'captured') { return acc }
            return acc + curr.commission
        }, 0)
    }

    const retrieveProcessingTransactions = (transactions) => {
        if (!transactions) { return 0 }
        return transactions.filter(transaction => {
            return transaction.operations.find(operation => operation.status === 'processing')
        }).length
    }

    // const retrieveRefundTransactions = (transactions) => {
    //     if (!transactions) { return 0 }
    //     return transactions.filter(transaction => {
    //         return transaction.Operations.find(operation => operation.status === 'refund')
    //     }).length
    // }

    const formatDate = (date) => {
      const formattedDate = new Date(date);
      const year = formattedDate.getFullYear();
      let month = formattedDate.getUTCMonth() + 1;
      let day = formattedDate.getDate();
      if (day < 10) day = `0${day}`;
      if (month < 10) month = `0${month}`;
      return `${year}-${month}-${day}`;
    }

    const formatDateFr = (date) => {
      const formattedDate = new Date(date);
      const year = formattedDate.getFullYear();
      let month = formattedDate.getUTCMonth() + 1;
      let day = formattedDate.getDate();
      if (day < 10) day = `0${day}`;
      if (month < 10) month = `0${month}`;
      return `${day}/${month}/${year}`;
    }

    const buildDateArray = (dates) => {
      const dateArray = []

      let currentDate = dates[0].getTime()
      const endDate = dates[1].getTime()

      while (currentDate < endDate) {
        dateArray.push({ x:formatDate(currentDate), y: 0})
        currentDate += 24 * 60 * 60 * 1000
      }

      dateArray.push({ x:formatDate(endDate), y: 0})
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
      if (!transactions) return undefined
      
      const finishedTransactions = transactions.filter(transaction => transaction.status === 'captured')

      const data = buildDateArray(dates.value)

      for (const transaction of finishedTransactions) {
        const finishedOperationHistory = transaction.operations.find(operation => operation.status === 'done').operationHistory.find(history => history.status === 'done')
        const date = formatDate(finishedOperationHistory.date)

        const index = data.map(elem => elem.x).indexOf(date)

        if (index !== -1) {
          data[index] = {
            ...data[index],
            y: data[index].y + transaction.commission
          }
        }        
      }

      buildChart(data)
    }
    
    const buildChartCreatedTransaction = (transactions) => {
      if (!transactions) return undefined

      const data = buildDateArray(dates.value)

      for (const transaction of transactions) {
        const date = formatDate(transaction.createdAt)

        const index = data.map(elem => elem.x).indexOf(date)

        if (index !== -1) {
          data[index] = {
            ...data[index],
            y: data[index].y + 1
          }
        }        
      }

      buildChart(data)
    }

    const buildChartProcessingTransaction = (transactions) => {
      if (!transactions) return undefined

      const processingTransactions = transactions.filter(transaction => transaction.operations.find(operation => operation.status === 'processing'))
    
      const data = buildDateArray(dates.value)

      for (const transaction of processingTransactions) {
        const processingOperationHistory = transaction.operations.find(operation => operation.status === 'processing').operationHistory.find(history => history.status === 'processing')
        const date = formatDate(processingOperationHistory.date)

        const index = data.map(elem => elem.x).indexOf(date)

        if (index !== -1) {
          data[index] = {
            ...data[index],
            y: data[index].y + 1
          }
        }        
      }

      buildChart(data)
    }

    // const buildChartRefundTransaction = (transactions) => {
    //   if (!transactions) return undefined

    //   const refundTransactions = transactions.filter(transaction => transaction.Operations.find(operation => operation.status === 'refund'))

    //   const data = buildDateArray(dates.value)

    //   for (const transaction of refundTransactions) {
    //     const createdOperation = transaction.Operations.find(operation => operation.status === 'finished')
    //     const date = formatDate(createdOperation.createdAt)

    //     const index = data.map(elem => elem.x).indexOf(date)

    //     if (index > 0) {
    //       data[index] = {
    //         ...data[index],
    //         y: data[index].y + 1
    //       }
    //     }
    //   }

    //   buildChart(data)
    // }

    const onDateChange = async (event) => {
        if (!event[0] || !event[1]) { return }
        const { data } = await transactionService.get({from: event[0], to: event[1]})

        transactionData.value = data.value
        
        revenues.value = retrieveRevenues(data.value)
        buildChartRevenues(data.value)
        buildDateArray(event)

        createdTransactions.value = data.value.length
        processingTransactions.value = retrieveProcessingTransactions(data.value)
        // refundTransactions.value = retrieveRefundTransactions(data.value)
    }

    const onSelectedMetricChange = (metric) => {
      selectedMetric.value = metric

      if (metric === 'Revenues') buildChartRevenues(transactionData.value)
      if (metric === 'Created transaction') buildChartCreatedTransaction(transactionData.value)
      if (metric === 'Processing transaction') buildChartProcessingTransaction(transactionData.value)
      // if (metric === 'Refund transaction') buildChartRefundTransaction(transactionData.value)
    }

    definePageMeta({
      layout: "admin",
    });

    onMounted(async () => {
      const { data } = await transactionService.get({from: dates.value[0], to: dates.value[1]})
      transactionData.value = data.value

      revenues.value = retrieveRevenues(data.value)
      buildChartRevenues(data.value)

      createdTransactions.value = data.value.length
      processingTransactions.value = retrieveProcessingTransactions(data.value)
      // refundTransactions.value = retrieveRefundTransactions(data.value)
    })
</script>

<template>
  <div>
      <div class="tw-flex tw-items-center tw-gap-1.5">
        <h2>Datas from : </h2>
        <Calendar v-model="dates" selectionMode="range" :manualInput="false" showButtonBar @update:modelValue="onDateChange"/>
      </div>
      <div class="tw-grid tw-grid-cols-4 tw-gap-4 tw-mt-4">
          <Card @click="onSelectedMetricChange('Revenues')">
              <template #title>Revenues</template>
              <template #content>
                  <p>
                      {{revenues}}
                  </p>
              </template>
          </Card>
          <Card @click="onSelectedMetricChange('Created transaction')">
              <template #title>Created Transaction</template>
              <template #content>
                  <p>
                      {{createdTransactions}}
                  </p>
              </template>
          </Card>
          <Card @click="onSelectedMetricChange('Processing transaction')">
              <template #title>Processing Transaction</template>
              <template #content>
                  <p>
                      {{processingTransactions}}
                  </p>
              </template>
          </Card>
          <Card @click="onSelectedMetricChange('Refund transaction')">
              <template #title>Refunded transaction</template>
              <template #content>
                  <p>
                      {{refundTransactions}}
                  </p>
              </template>
          </Card>
      </div>
      <Card class="tw-mt-4">
        <template #title> {{selectedMetric}} from {{`${formatDateFr(dates[0])} to ${formatDateFr(dates[1])}`}}</template>
        <template #content>
          <canvas ref="chart"></canvas>
        </template>
      </Card>
  </div>
</template>
