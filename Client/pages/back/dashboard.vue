<script setup>
import { ref } from "vue";
import { useUserStore } from "~/store/user";
import transactionService from "~/services/transaction";

definePageMeta({
  layout: "back",
});

let transactionData = ref([])
const { user } = useUserStore()

//retrieve all today's transactions
const todayTransactions = (transactions) => {
  if (!transactions) return 0
  const today = new Date()
  return transactions.filter(transaction => transaction.createdAt.includes(today.toISOString().slice(0, 10))).length
}

//retrieve transaction.finalAmount per status in parameter for every day between today and the last 31 days.
const lastThirtyOneDaysTransactionsFromToday = (transactions) => {
  if (!transactions) return 0
  const today = new Date()
  const lastThirtyOneDays = new Date(today.setDate(today.getDate() - 31))
  return transactions.filter(transaction => transaction.updatedAt >= lastThirtyOneDays.toISOString().slice(0, 10)).reduce((acc, transaction) => {
    return acc + (transaction.finalAmount)? transaction.finalAmount : 0
  }, 0)
}

// if (!transactions) return 0
// const today = new Date()
// const lastThirtyOneDays = new Date(today.setDate(today.getDate() - 31))
// return transactions.filter(transaction => {
//   return transaction.operations.find(operation => {
//     const operationDate = new Date(operation.createdAt)
//     return operationDate >= lastThirtyOneDays
//   })
// }).reduce((acc, transaction) => {
//   return acc + transaction.operations.reduce((acc, operation) => {
//     if (operation.type === 'capture' && operation.status === 'done') {
//       return acc + operation.amount
//     } else if (operation.type === 'refund' && operation.status === 'done') {
//       return acc - operation.amount
//     } else {
//       return acc
//     }
//   }, 0)
// }, 0)

//retrieve all transactions per month. function that returns an array of the amount of transactions for the 8 last month (from the current month) without filtering by operations status
const totalTransactionsPerMonth = (transactions) => {
  if (!transactions) return 0
  const months = getPastMonths(8)
  return months.map(month => {
    month = month.split('/').reverse().join('-') //format the month to be YYYY-MM
    return transactions.filter(transaction => transaction.createdAt.includes(month)).length
  })
}

//retrieve amount of transactions per status
const retrieveTransactions = (transactions, status) => {
  if (!transactions) return 0
  return transactions.filter(transaction => transaction.status === status).length
}

const retrieveAmountTransactions = (transactions) => {
  if (!transactions) return 0
  return transactions.filter(transaction => transaction.status === 'captured' || transaction.status === 'partially-refunded' || transaction.status === 'refunded').reduce((acc, transaction) => {
    return acc + transaction.amount
  }, 0)
}

const retrieveAmountRefundedTransactions = (transactions) => {
  if (!transactions) return 0
  return transactions.filter(transaction => transaction.status === "partially-refunded" || transaction.status === 'refunded').reduce((acc, transaction) => {
    return acc + transaction.amount
  }, 0)
}

//retrieve amount of transactions per month. function that returns an array of the amount of transactions for the 12 last month (from the current month) for a specific status
const retrieveTransactionsPerMonth = (transactions, status) => {
  if (!transactions) return 0
  const months = getPastMonths(12)
  return months.map(month => {
    month = month.split('/').reverse().join('-') //format the month to be YYYY-MM
    return transactions.filter(transaction => transaction.status === status && transaction.updatedAt.includes(month)).length
  })
}

//StatusChart
const statusChartData = ref();
const statusChartOptions = ref({
  cutout: '60%',
  color: 'white',
  responsive: true,
  maintainAspectRatio: false,
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

//StatusTimeChart
const statusTimeChartData = ref();
const statusTimeChartOptions = ref();

//salesTimeChart
const salesTimeChartData = ref();
const salesTimeChartOptions = ref({
  responsive: true,
  aspectRatio: 1.5,
  plugins: {
    title: {
      display: true,
      text: 'Sales per month',
      font: {
        size: 24,
        weight: 'bold'
      },
      color: 'white'
    },
    legend: { labels: false }
  },
  scales: {
    x: { ticks: { color: 'white' } },
    y: { ticks: { color: 'white' } }
  }
});

function getPastMonths(numOfMonths) {
  const months = [];
  const currentDate = new Date();

  for (let i = 0; i < numOfMonths; i++) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Adding 1 as getMonth() returns 0-based index
    const formattedMonth = month < 10 ? '0' + month : month.toString();
    months.unshift(`${formattedMonth}/${year}`); // Use unshift() to add at the beginning of the array
    currentDate.setMonth(currentDate.getMonth() - 1);// Move to the previous month
  }

  return months;
}

onMounted(async () => {
  const { data } = await transactionService.get({ companyId: user.Company.id })
  transactionData.value = data.value

  salesTimeChartData.value = setSalesTimeChartData();
  statusChartData.value = setStatusChartData();
  statusTimeChartData.value = setStatusTimeChartData();
  statusTimeChartOptions.value = setStatusTimeChartOptions();
})

const setSalesTimeChartData = () => {
  return {
    labels: getPastMonths(8),
    datasets: [{
      data: totalTransactionsPerMonth(transactionData.value),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
};

const setStatusChartData = () => {
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: ['Created', 'Captured', 'Canceled', 'Partially refunded', 'Refunded'],
    datasets: [
      {
        data: [
          retrieveTransactions(transactionData.value, 'created'),
          retrieveTransactions(transactionData.value, 'captured'),
          retrieveTransactions(transactionData.value, 'canceled'),
          retrieveTransactions(transactionData.value, 'partially-refunded'),
          retrieveTransactions(transactionData.value, 'refunded')
        ],
        backgroundColor: [documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500'), "#f36d6d", documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--blue-500')],
        hoverBackgroundColor: [documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400'), "#f36d6d", documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--blue-400')]
      }
    ]
  };
};

const setStatusTimeChartData = () =>  {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: getPastMonths(12),
    datasets: [
      {
        type: 'bar',
        label: 'Created',
        backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
        data: retrieveTransactionsPerMonth(transactionData.value, 'created')
      },
      {
        type: 'bar',
        label: 'Captured',
        backgroundColor: documentStyle.getPropertyValue('--green-500'),
        data: retrieveTransactionsPerMonth(transactionData.value, 'captured')
      },
      {
        type: 'bar',
        label: 'Canceled',
        backgroundColor: "#f36d6d",
        data: retrieveTransactionsPerMonth(transactionData.value, 'canceled')
      },
      {
        type: 'bar',
        label: 'Partially refunded',
        backgroundColor: documentStyle.getPropertyValue('--orange-500'),
        data: retrieveTransactionsPerMonth(transactionData.value, 'partially-refunded')
      },
      {
        type: 'bar',
        label: 'Refunded',
        backgroundColor: documentStyle.getPropertyValue('--blue-500'),
        data: retrieveTransactionsPerMonth(transactionData.value, 'refunded')
      }
    ]
  };
};

const setStatusTimeChartOptions = () =>  {
  return {
    maintainAspectRatio: true,
    aspectRatio: 4,
    plugins: {
      tooltips: {
        mode: 'index',
        intersect: false
      },
      legend: {
        labels: { color: 'white' }
      },
      title: {
        display: true,
        text: 'transactions status per month',
        font: {
          size: 24,
          weight: 'bold'
        },
        color: 'white'
      },
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
  };
};
</script>

<template>
  <div>
    <div class="grid tw-w-full">
      <div class="card cardStats stat1">
        <p class="tw-text-4xl tw-font-bold tw-p-3">{{ todayTransactions(transactionData) }}</p>
        <p class="tw-text-sm tw-pl-3 tw-pb-3">Today's transactions</p>
        <div>
          <div class="tw-p-3 tw-flex tw-justify-between">
            <i class="mdi mdi-arrow-top-right tw-text-xl"></i>
          </div>
        </div>
      </div>
      <div class="card cardStats stat2">
        <p class="tw-text-4xl tw-font-bold tw-p-3">{{ retrieveAmountTransactions(transactionData) }} €</p>
        <p class="tw-text-sm tw-pl-3 tw-pb-3">Total amount of sales</p>
        <div class="tw-bg-primary-light">
          <div class="tw-p-3 tw-flex tw-justify-between">
            <i class="mdi mdi-arrow-top-right tw-text-xl"></i>
          </div>
        </div>
      </div>
      <div class="card cardStats stat3">
        <p class="tw-text-4xl tw-font-bold tw-p-3">{{ retrieveAmountRefundedTransactions(transactionData) }} €</p>
        <p class="tw-text-sm tw-pl-3 tw-pb-3">Total amount of refunded transactions</p>
        <div class="tw-bg-primary-light">
          <div class="tw-p-3 tw-flex tw-justify-between">
            <i class="mdi mdi-arrow-top-right tw-text-xl"></i>
          </div>
        </div>
      </div>
      <div class="card cardStats stat4">
        <!--TODO: change the value so I only takes the last month-->
        <p class="tw-text-4xl tw-font-bold tw-p-3">{{ lastThirtyOneDaysTransactionsFromToday(transactionData) }} €</p>
        <p class="tw-text-sm tw-pl-3 tw-pb-3">profits over last month</p>
        <div class="tw-bg-primary-light">
          <div class="tw-p-3 tw-flex tw-justify-between">
            <i class="mdi mdi-arrow-top-right tw-text-xl"></i>
          </div>
        </div>
      </div>

      <!--Line chart sales status per time-->
      <div class="card salesTimeChart">
        <Chart type="line" :data="salesTimeChartData" :options="salesTimeChartOptions" class="h-30rem" />
      </div>

      <!--Donut chart transactions status-->
      <div class="card statusChart tw-flex tw-justify-center tw-flex-col">
        <Chart type="doughnut" :data="statusChartData" :options="statusChartOptions" class="md:w-30rem" />
      </div>

      <!--Bar chart transactions status per time-->
      <div class="card statusTimeChart tw-flex tw-justify-center">
        <Chart type="bar" :data="statusTimeChartData" :options="statusTimeChartOptions" class="md:h-30rem" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  grid-template-areas:
  "stat1 stat2 stat3 stat4"
  "salesTimeChart salesTimeChart statusChart statusChart"
  "salesTimeChart salesTimeChart statusChart statusChart"
  "statusTimeChart statusTimeChart statusTimeChart statusTimeChart"
}

.card {
  background-color: rgba(150, 152, 158, 0.62);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.cardStats.stat1 {
  grid-area: stat1;

  div:first-child {
    background-color: #4BC0C0;
  }
}

.cardStats.stat2 {
  grid-area: stat2;

  div:first-child {
    background-color: #9966FE;
  }
}

.cardStats.stat3 {
  grid-area: stat3;

  div:first-child {
    background-color: #36A2EB;
  }
}

.cardStats.stat4 {
  grid-area: stat4;

  div:first-child {
    background-color: #f36d6d;
  }
}

.salesTimeChart {
  grid-area: salesTimeChart;
  padding: 20px;
}

.statusChart {
  grid-area: statusChart;
  padding: 20px;

  div:first-child {
    width: 100%;
    height: 100%;
  }
}

.statusTimeChart {
  grid-area: statusTimeChart;
  padding: 20px;

  div:first-child {
    width: 100%;
    height: 100%;
  }
}
</style>
