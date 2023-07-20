<script setup>
import { ref } from "vue";

definePageMeta({
  layout: "back",
});

let transactionData = ref();

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
  }
});

//StatusTimeChart
const statusTimeChartData = ref();
const statusTimeChartOptions = ref();

//salesTimeChart
const salesTimeChartData = ref({
  labels: getPast8Months(),
  datasets: [{
    data: [0, 59, 80, 81, 56, 55, 40, 92],
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }],
});
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

function getPast8Months() {
  const months = [];
  const currentDate = new Date();

  for (let i = 0; i < 8; i++) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Adding 1 as getMonth() returns 0-based index
    const formattedMonth = month < 10 ? '0' + month : month.toString();
    months.unshift(`${formattedMonth}/${year}`); // Use unshift() to add at the beginning of the array

    // Move to the previous month
    currentDate.setMonth(currentDate.getMonth() - 1);
  }

  return months;
}

const totalTransactions = (transactions) => {
  if (!transactions) return 0
  return transactions.length
}

const retrieveTransactions = (transactions, status) => {
  if (!transactions) return 0
  return transactions.filter(transaction => {
    return transaction.Operations.find(operation => operation.status === status)
  }).length
}

//retrieve amount of transactions per status confirmed
const retrieveAmountTransactions = (transactions, status) => {
  if (!transactions) return 0
  return transactions.filter(transaction => {
    return transaction.Operations.find(operation => operation.status === status)
  }).reduce((acc, transaction) => {
    return acc + transaction.amount
  }, 0)
}

if (process.client) {

  onMounted(async () => {
    //TODO: mettre à jour la route pour récupérer les transactions d'un marchand
    const {data, error} = await useFetch("http://localhost:3000/transaction");
    if (error.value) console.log(error.value)
    transactionData.value = data.value


    statusChartData.value = setStatusChartData();

    statusTimeChartData.value = setStatusTimeChartData();
    statusTimeChartOptions.value = setStatusTimeChartOptions();
  })

  const setStatusChartData = () => {
    const documentStyle = getComputedStyle(document.body);

    return {
      labels: ['Confirmed', 'Canceled', 'Refunded'],
      datasets: [
        {
          data: [
            // retrieveTransactions(transactionData.value, 'finish'),
            // retrieveTransactions(transactionData.value, 'cancel'),
            // retrieveTransactions(transactionData.value, 'refund')
            540, 325, 702
          ],
          backgroundColor: [documentStyle.getPropertyValue('--green-500'), "#f36d6d", documentStyle.getPropertyValue('--blue-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--green-400'), "#f36d6d", documentStyle.getPropertyValue('--blue-400')]
        }
      ]
    };
  };

  function getPast12Months() {
    const months = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Adding 1 as getMonth() returns 0-based index
      const formattedMonth = month < 10 ? '0' + month : month.toString();
      months.unshift(`${formattedMonth}/${year}`); // Use unshift() to add at the beginning of the array

      // Move to the previous month
      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    return months;
  }

  const setStatusTimeChartData = () =>  {
    const documentStyle = getComputedStyle(document.documentElement);

    //TODO: mettre à jour les données pour récupérer les transactions d'un marchand selon le mois
    return {
      labels: getPast12Months(),
      datasets: [
        {
          type: 'bar',
          label: 'Confirmed',
          backgroundColor: documentStyle.getPropertyValue('--green-500'),

          //map sur les 12 mois et pour chaque mois, on récupère le nombre de transactions confirmées
          //data: retrieveTransactions(transactionData.value, 'finish')
          data: [80, 62, 39, 11, 25, 37, 33, 14, 95, 89, 84, 77]
        },
        {
          type: 'bar',
          label: 'Canceled',
          backgroundColor: "#f36d6d",
          data: [18, 26, 7, 38, 32, 11, 33, 5, 4, 20, 27, 32]
        },
        {
          type: 'bar',
          label: 'Refunded',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          data: [10, 5, 2, 8, 3, 3, 4, 9, 2, 6, 2, 1]
        }
      ]
    };
  };
  const setStatusTimeChartOptions = () =>  {
    return {
      maintainAspectRatio: false,
      aspectRatio: 1.5,
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
}
</script>

<template>
  <div>
    <div class="grid tw-w-full">
      <div class="card cardStats stat1">
        <p class="tw-text-4xl tw-font-bold tw-p-3">{{ totalTransactions(transactionData) }}</p>
        <p class="tw-text-sm tw-pl-3 tw-pb-3">Today's transactions</p>
        <div>
          <div class="tw-p-3 tw-flex tw-justify-between">
            <p>% change</p>
            <i class="mdi mdi-arrow-top-right tw-text-xl"></i>
          </div>
        </div>
      </div>
      <div class="card cardStats stat2">
        <p class="tw-text-4xl tw-font-bold tw-p-3">{{ retrieveAmountTransactions(transactionData, "finish") }}</p>
        <p class="tw-text-sm tw-pl-3 tw-pb-3">Total amount of sales</p>
        <div class="tw-bg-primary-light">
          <div class="tw-p-3 tw-flex tw-justify-between">
            <p>% change</p>
            <i class="mdi mdi-arrow-top-right tw-text-xl"></i>
          </div>
        </div>
      </div>
      <div class="card cardStats stat3">
        <p class="tw-text-4xl tw-font-bold tw-p-3">{{ retrieveAmountTransactions(transactionData, "refund") }}</p>
        <p class="tw-text-sm tw-pl-3 tw-pb-3">Total amount of refunded transactions</p>
        <div class="tw-bg-primary-light">
          <div class="tw-p-3 tw-flex tw-justify-between">
            <p>% change</p>
            <i class="mdi mdi-arrow-top-right tw-text-xl"></i>
          </div>
        </div>
      </div>
      <div class="card cardStats stat4">
        <!--TODO: change the value so I only takes the last month-->
        <p class="tw-text-4xl tw-font-bold tw-p-3">{{ retrieveAmountTransactions(transactionData, "finish") }}</p>
        <p class="tw-text-sm tw-pl-3 tw-pb-3">profits over last month</p>
        <div class="tw-bg-primary-light">
          <div class="tw-p-3 tw-flex tw-justify-between">
            <p>% change</p>
            <i class="mdi mdi-arrow-top-right tw-text-xl"></i>
          </div>
        </div>
      </div>

      <!--Donut chart transactions status-->
      <div class="card statusChart tw-flex tw-justify-center tw-flex-col">
        <Chart type="doughnut" :data="statusChartData" :options="statusChartOptions" class="md:w-30rem" />
      </div>

      <!--Bar chart transactions status per time-->
      <div class="card statusTimeChart tw-flex tw-justify-center">
        <Chart type="bar" :data="statusTimeChartData" :options="statusTimeChartOptions" class="md:h-30rem" />
      </div>

      <!--Line chart sales status per time-->
      <div class="card salesTimeChart">
        <Chart type="line" :data="salesTimeChartData" :options="salesTimeChartOptions" class="h-30rem" />
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
