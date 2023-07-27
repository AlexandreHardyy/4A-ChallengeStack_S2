<script setup>
    import { ref } from "vue";
    import { Chart } from "chart.js/auto";

    import transactionService from '~/services/transaction';

    const today = new Date()
    const dates = ref([ new Date(today.setDate(today.getDate() - 7)), new Date()]);

    const chart = ref(null);
    const chartRef = ref(null)
    const selectedMetric = ref('Revenues');

    const revenues = ref();
    const amountTransactions = ref();
    const amountRefundedTransactions = ref();
    const createdTransactions = ref();
    const finishedTransactions = ref();
    const canceledTransactions = ref();
    const processingTransactions = ref();
    const refundedTransactions = ref();
    const partiallyRefundTransactions = ref();

    const statistics = ref({
      transactionNumber: 0,
      avgTransactionAmount: 0,
      percentageRefundedTransactions: 0,
      avgOperationsByTransaction: 0
    })

    //StatusChart
    const statusChartData = ref();
    const statusChartOptions = ref({
      cutout: '60%',
      color: 'white',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: 'Total transaction per status',
          font: {
            size: 24,
            weight: 'bold'
          },
          color: 'white'
        },
        legend: { position: 'left' }
      }
    });

    //RevenuesChart
    const revenuesChartData = ref();
    const revenuesChartOptions = ref({
      cutout: '60%',
      color: 'white',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: 'Global revenues',
          font: {
            size: 24,
            weight: 'bold'
          },
          color: 'white'
        }
      }
    });

    const setStatusChartData = () => {
      const documentStyle = getComputedStyle(document.body);

      return {
        labels: ['Created', 'Captured', 'Canceled', 'Partially refunded', 'Refunded'],
        datasets: [
          {
            data: [
              createdTransactions,
              finishedTransactions,
              canceledTransactions,
              partiallyRefundTransactions,
              refundedTransactions,
            ],
            backgroundColor: [documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500'), "#f36d6d", documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--blue-500')],
            hoverBackgroundColor: [documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400'), "#f36d6d", documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--blue-400')]
          }
        ]
      };
    };

    const setRevenuesChartData = () => {
      const documentStyle = getComputedStyle(document.body);

      return {
        labels: ['revenues', 'all transactions revenues', 'Refunded transaction\'s amount'],
        datasets: [
          {
            data: [
              revenues,
              amountTransactions,
              amountRefundedTransactions
            ],
            backgroundColor: [documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500'), "#f36d6d", documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--blue-500')],
            hoverBackgroundColor: [documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400'), "#f36d6d", documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--blue-400')]
          }
        ]
      };
    };

    const retrieveRevenues = (transactions) => {
        if (!transactions) { return 0 }
        return transactions.reduce((acc, curr) => {
            if (curr.status !== 'captured' && curr.status !== 'partially-refunded' && curr.status !== 'refunded') { return acc }
            return Math.round((acc + curr.commission) * 100) / 100
        }, 0)
    }

    const retrieveAmountTransactions = (transactions) => {
      if (!transactions) return 0
      return transactions.filter(transaction => transaction.status === 'captured' || transaction.status === 'partially-refunded' || transaction.status === 'refunded').reduce((acc, transaction) => {
        return acc + transaction.finalAmount
      }, 0)
    }

    const retrieveAmountRefundedTransactions = (transactions) => {
      if (!transactions) return 0
      return transactions.filter(transaction => transaction.status === "partially-refunded" || transaction.status === 'refunded').reduce((acc, transaction) => {
        return acc + transaction.amount
      }, 0)
    }

    //numberOfTransactions
    const retrieveNumberOfTransactions = (transactions) => {
      if (!transactions) { return 0 }
      return transactions.length
    }

    //averageTransactionAmount
    const retrieveAverageTransactionAmount = (transactions) => {
      if (!transactions) { return 0 }
      return Math.round(transactions.reduce((acc, curr) => acc + curr.amount, 0) / transactions.length * 100) / 100
    }

    //percentageOfRefundedOrPartiallyRefundedTransactions
    const refundedTransactionPercentage = (transactions) => {
      if (!transactions) { return 0 }
      return Math.round(transactions.filter(transaction => transaction.status === 'refunded' || transaction.status === 'partially-refunded').length / transactions.length * 100)
    }

    //average operation per transaction
    const averageOperationPerTransaction = (transactions) => {
      if (!transactions) { return 0 }
      return Math.round(transactions.reduce((acc, curr) => acc + curr.operations.length, 0) / transactions.length * 100) / 100
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
          },
          scales: {
            x: {
              stacked: true,
              ticks: { color: 'white' },
            },
            y: {
              stacked: true,
              ticks: { color: 'white' },
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
      
      const finishedTransactions = transactions.filter(transaction => transaction.status === 'captured' || transaction.status === 'refunded' || transaction.status === 'partially-refunded')

      const finishedTransactionsData = buildDateArray(dates.value)

      for (const transaction of finishedTransactions) {
        const date = formatDate(transaction.updatedAt)

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
      buildChart('line', data)
    }

    const setData = (data) => {
      revenues.value = retrieveRevenues(data)
      amountTransactions.value = retrieveAmountTransactions(data)
      amountRefundedTransactions.value = retrieveAmountRefundedTransactions(data)
      buildChartRevenues(data)

      createdTransactions.value = retrieveTransactionsByStatus(data, 'created').length
      finishedTransactions.value = retrieveTransactionsByStatus(data, 'captured').length
      canceledTransactions.value = retrieveTransactionsByStatus(data, 'canceled').length
      refundedTransactions.value = retrieveTransactionsByStatus(data, 'refunded').length
      partiallyRefundTransactions.value = retrieveTransactionsByStatus(data, 'partially-refunded').length
      processingTransactions.value = retrieveProcessingTransactions(data).length

      statistics.value.transactionNumber = createdTransactions.value
      statistics.value.avgTransactionAmount = retrieveAverageTransactionAmount(data)
      statistics.value.percentageRefundedTransactions = refundedTransactionPercentage(data)
      statistics.value.avgOperationsByTransaction = averageOperationPerTransaction(data)

      statusChartData.value = setStatusChartData();
      revenuesChartData.value = setRevenuesChartData();
      
    }

    const onDateChange = async (event) => {
      if (!event[0] || !event[1]) { return }
      const { data } = await transactionService.get({from: event[0], to: event[1]})
      setData(data.value)
    }

    onMounted(async () => {
      const { data } = await transactionService.get({from: dates.value[0], to: dates.value[1]})
      setData(data.value)
    })

    definePageMeta({
      layout: "admin",
    });

</script>

<template>
  <div>
      <div class="tw-flex tw-items-center tw-gap-1.5">
        <h2>Datas from : </h2>
        <Calendar v-model="dates" selectionMode="range" :manualInput="false" showButtonBar @update:modelValue="onDateChange" style="width: 13em"/>
      </div>
      <div class="tw-grid tw-grid-cols-3 tw-gap-3 tw-mt-3">
        <!--Donut chart transactions status-->
        <div class="card statusChart tw-flex tw-justify-center tw-flex-col">
          <ChartPrime type="doughnut" :data="revenuesChartData" :options="revenuesChartOptions" class="md:w-30rem" />
        </div>
          <Card class="card">
              <template #title>Statistics</template>
              <template #content>
                  <div class="alignFlex">
                    <label for="numberOfTransaction">Number of transactions :</label>
                    <h1 id="numberOfTransaction">{{ statistics.transactionNumber }}</h1>
                  </div>
                  <div class="alignFlex">
                    <label for="numberOfTransaction">Average amount of a transaction :</label>
                    <h1 id="numberOfTransaction">{{ statistics.avgTransactionAmount }}€</h1>
                  </div>
                  <div class="alignFlex">
                    <label for="numberOfTransaction">Percentage of refunded transactions :</label>
                    <h1 id="numberOfTransaction">{{ statistics.percentageRefundedTransactions }}%</h1>
                  </div>
                  <div class="alignFlex">
                    <label for="numberOfTransaction">average operation per transaction :</label>
                    <h1 id="numberOfTransaction">{{ statistics.avgOperationsByTransaction }}</h1>
                  </div>
              </template>
          </Card>

          <!--Donut chart transactions status-->
          <div class="card statusChart tw-flex tw-justify-center tw-flex-col">
            <ChartPrime type="doughnut" :data="statusChartData" :options="statusChartOptions" class="md:w-30rem" />
          </div>
      </div>
      <Card class="tw-mt-4 card">
        <template #title> {{ selectedMetric }} from {{`${ formatDateFr(dates[0]) } to ${ formatDateFr(dates[1]) }`}}</template>
        <template #content>
          <canvas ref="chart"></canvas>
        </template>
      </Card>
  </div>
</template>

<style scoped>
.card {
  background-color: rgba(150, 152, 158, 0.62);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.alignFlex {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>