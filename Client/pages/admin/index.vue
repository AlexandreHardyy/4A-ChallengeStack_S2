<script setup>
    import { ref } from "vue";
    import {Chart} from "chart.js/auto";

    import transactionService from '~/services/transaction';

    const transactionData = ref()

    const today = new Date()
    const dates = ref([ new Date(today.setDate(today.getDate() - 7)), new Date()]);

    const chart = ref(null);
    const chartRef = ref(null)
    const selectedMetric = ref('Revenues');

    const revenues = ref();
    const createdTransactions = ref();
    const finishedTransactions = ref();
    const canceledTransactions = ref();
    const processingTransactions = ref();
    const refundedTransactions = ref();
    const partiallyRefundTransactions = ref();

    const retrieveRevenues = (transactions) => {
        if (!transactions) { return 0 }
        return transactions.reduce((acc, curr) => {
            if (curr.status !== 'captured' && curr.status !== 'partially-refunded' && curr.status !== 'refunded') { return acc }
            return Math.round((acc + curr.commission) * 100) / 100
        }, 0)
    }

    const retrieveTransactionsByStatus = (transactions, status) => {
      if (!transactions) { return 0 }
      return transactions.filter(transaction => transaction.status === status )
    }

    const retrieveProcessingTransactions = (transactions) => {
        if (!transactions) { return 0 }
        return transactions.filter(transaction => {
            return transaction.operations.find(operation => operation.status === 'processing' && operation.type === 'capture')
        })
    }

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

    const buildChart = (type, data) => {
      const config = {
        type,
        data,
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

      const finishedTransactionsData = buildDateArray(dates.value)

      for (const transaction of finishedTransactions) {
        const finishedOperationHistory = transaction.operations.find(operation => operation.status === 'done').operationHistory.find(history => history.status === 'done')
        const date = formatDate(finishedOperationHistory.date)

        const index = finishedTransactionsData.map(elem => elem.x).indexOf(date)

        if (index !== -1) {
          finishedTransactionsData[index] = {
            ...finishedTransactionsData[index],
            y: finishedTransactionsData[index].y + transaction.commission
          }
        }        
      }

      const data = {
        datasets: [
          {
            data: finishedTransactionsData
          }
        ]
      }

      buildChart('bar', data)
    }
    
    const buildChartCreatedTransaction = (transactions) => {
      if (!transactions) return undefined

      const createdTransactionsData = buildDateArray(dates.value)

      for (const transaction of transactions) {
        const date = formatDate(transaction.createdAt)

        const index = createdTransactionsData.map(elem => elem.x).indexOf(date)

        if (index !== -1) {
          createdTransactionsData[index] = {
            ...createdTransactionsData[index],
            y: createdTransactionsData[index].y + 1
          }
        }        
      }

      const data = {
        datasets: [
          {
            data: createdTransactionsData
          }
        ]
      }

      buildChart('bar', data)
    }

    const buildChartProcessingTransaction = (transactions) => {
      if (!transactions) return undefined

      const finishedTransactions = retrieveTransactionsByStatus(transactions, 'captured')
      const canceledTransactions = retrieveTransactionsByStatus(transactions, 'canceled')
      const processingTransactions = retrieveProcessingTransactions(transactions)
    
      const finishedTransactionsData = buildDateArray(dates.value)
      const canceledTransactionsData = buildDateArray(dates.value)
      const processingTransactionsData = buildDateArray(dates.value)

      for (const transaction of finishedTransactions) {
        const finishedOperationHistory = transaction.operations.find(operation => operation.status === 'done').operationHistory.find(history => history.status === 'done')
        const date = formatDate(finishedOperationHistory.date)

        const index = finishedTransactionsData.map(elem => elem.x).indexOf(date)

        if (index !== -1) {
          finishedTransactionsData[index] = {
            ...finishedTransactionsData[index],
            y: finishedTransactionsData[index].y + 1
          }
        }        
      }

      for (const transaction of canceledTransactions) {
        console.log('Armand', canceledTransactions);
        const canceledOperationHistory = transaction.transactionHistory.find(history => history.status === 'canceled')
        const date = formatDate(canceledOperationHistory.date)

        const index = canceledTransactionsData.map(elem => elem.x).indexOf(date)

        if (index !== -1) {
          canceledTransactionsData[index] = {
            ...canceledTransactionsData[index],
            y: canceledTransactionsData[index].y + 1
          }
        }        
      }

      for (const transaction of processingTransactions) {
        const processingOperationHistory = transaction.operations.find(operation => operation.status === 'processing').operationHistory.find(history => history.status === 'processing')
        const date = formatDate(processingOperationHistory.date)

        const index = processingTransactionsData.map(elem => elem.x).indexOf(date)

        if (index !== -1) {
          processingTransactionsData[index] = {
            ...processingTransactionsData[index],
            y: processingTransactionsData[index].y + 1
          }
        }        
      }

      const data = {
        labels: finishedTransactionsData.map(data => data.x),
        datasets: [
          {
            label: 'Finished Transactions',
            data: finishedTransactionsData
          },
          {
            label: 'Canceled Transactions',
            data: canceledTransactionsData
          },
          {
            label: 'Finished Transactions',
            data: processingTransactionsData
          }
        ]
      } 

      buildChart('line', data)
    }

    const onDateChange = async (event) => {
        if (!event[0] || !event[1]) { return }
        const { data } = await transactionService.get({from: event[0], to: event[1]})

        transactionData.value = data.value
        
        revenues.value = retrieveRevenues(data.value)
        buildChartRevenues(data.value)
        buildDateArray(event)

        createdTransactions.value = data.value.length
        finishedTransactions.value = retrieveTransactionsByStatus(data.value, 'captured').length
        canceledTransactions.value = retrieveTransactionsByStatus(data.value, 'canceled').length
        refundedTransactions.value = retrieveTransactionsByStatus(data.value, 'refunded').length
        partiallyRefundTransactions.value = retrieveTransactionsByStatus(data.value, 'partially-refunded').length
        processingTransactions.value = retrieveProcessingTransactions(data.value).length
    }

    const onSelectedMetricChange = (metric) => {
      selectedMetric.value = metric

      if (metric === 'Revenues') buildChartRevenues(transactionData.value)
      if (metric === 'Created transaction') buildChartCreatedTransaction(transactionData.value)
      if (metric === 'Status transaction') buildChartProcessingTransaction(transactionData.value)
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
      finishedTransactions.value = retrieveTransactionsByStatus(data.value, 'captured').length
      canceledTransactions.value = retrieveTransactionsByStatus(data.value, 'canceled').length
      processingTransactions.value = retrieveProcessingTransactions(data.value).length
      refundedTransactions.value = retrieveTransactionsByStatus(data.value, 'refunded').length
      partiallyRefundTransactions.value = retrieveTransactionsByStatus(data.value, 'partially-refunded').length
    })
</script>

<template>
  <div>
      <div class="tw-flex tw-items-center tw-gap-1.5">
        <h2>Datas from : </h2>
        <Calendar v-model="dates" selectionMode="range" :manualInput="false" showButtonBar @update:modelValue="onDateChange"/>
      </div>
      <div class="tw-grid tw-grid-cols-3 tw-gap-3 tw-mt-3">
          <Card @click="onSelectedMetricChange('Revenues')">
              <template #title>Revenues</template>
              <template #content>
                  <p>
                      {{ revenues }}
                  </p>
              </template>
          </Card>
          <Card @click="onSelectedMetricChange('Created transaction')">
              <template #title>Created Transaction</template>
              <template #content>
                  <p>
                      {{ createdTransactions }}
                  </p>
              </template>
          </Card>
          <Card @click="onSelectedMetricChange('Status transaction')">
              <template #title>Transaction Status</template>
              <template #content>
                  <p>Finished: {{ finishedTransactions }}</p>
                  <p>Canceled: {{ canceledTransactions }}</p>
                  <p>Processing: {{ processingTransactions }}</p>
                  <p>Partially-refunded: {{ partiallyRefundTransactions }}</p>
                  <p>Refunded: {{ refundedTransactions }}</p>
              </template>
          </Card>
      </div>
      <Card class="tw-mt-4">
        <template #title> {{ selectedMetric }} from {{`${ formatDateFr(dates[0]) } to ${ formatDateFr(dates[1]) }`}}</template>
        <template #content>
          <canvas ref="chart"></canvas>
        </template>
      </Card>
  </div>
</template>
