<script setup>
import {Chart} from "chart.js/auto";

definePageMeta({
  layout: "back",
});

const chart = ref(null);

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
];
const data = {
  labels: labels,
  datasets: [{
    label: 'My First dataset',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [0, 10, 5, 2, 20, 30, 45],
  }]
};

const config = {
  type: 'line',
  data: data,
  options: {
    plugins: {
      legend: {
        display: false
      }
    }
  }
};

if (process.client) {

  onMounted(() => {
    DrawChart()
  })
  const DrawChart = () => {
    new Chart(
        chart.value,
        config
    );
  }
}
</script>

<template>
  <div>
    <div class="tw-w-full tw-flex tw-justify-between tw-gap-5 tw-flex-wrap">
      <div class="cardStats stat1">
        <p class="tw-text-4xl tw-font-bold tw-p-3">30200</p>
        <p class="tw-text-sm tw-pl-3 tw-pb-3">Total transaction</p>
        <div>
          <div class="tw-p-3 tw-flex tw-justify-between">
            <p>% change</p>
            <i class="mdi mdi-arrow-top-right tw-text-xl"></i>
          </div>
        </div>
      </div>
      <div class="cardStats stat2">
        <p class="tw-text-4xl tw-font-bold tw-p-3">30200</p>
        <p class="tw-text-sm tw-pl-3 tw-pb-3">Total sales</p>
        <div class="tw-bg-primary-light">
          <div class="tw-p-3 tw-flex tw-justify-between">
            <p>% change</p>
            <i class="mdi mdi-arrow-top-right tw-text-xl"></i>
          </div>
        </div>
      </div>
      <div class="cardStats stat3">
        <p class="tw-text-4xl tw-font-bold tw-p-3">30200</p>
        <p class="tw-text-sm tw-pl-3 tw-pb-3">Total transaction</p>
        <div class="tw-bg-primary-light">
          <div class="tw-p-3 tw-flex tw-justify-between">
            <p>% change</p>
            <i class="mdi mdi-arrow-top-right tw-text-xl"></i>
          </div>
        </div>
      </div>
      <div class="cardStats stat4">
        <p class="tw-text-4xl tw-font-bold tw-p-3">30200</p>
        <p class="tw-text-sm tw-pl-3 tw-pb-3">Total transaction</p>
        <div class="tw-bg-primary-light">
          <div class="tw-p-3 tw-flex tw-justify-between">
            <p>% change</p>
            <i class="mdi mdi-arrow-top-right tw-text-xl"></i>
          </div>
        </div>
      </div>
    </div>
    <div>
      <canvas ref="chart"></canvas>
    </div>
  </div>
</template>

<style scoped>

.cardStats {
  flex: 1 1 20%;
  background-color: #565656;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-width: 210px;
}

.cardStats.stat1 {
  div:first-child {
    background-color: theme("colors.primary-light");
  }
}

.cardStats.stat2 {
  div:first-child {
    background-color: theme("colors.primary-light");
  }
}

.cardStats.stat3 {
  div:first-child {
    background-color: #59d359;
  }
}

.cardStats.stat4 {
  div:first-child {
    background-color: #f36d6d;
  }
}
</style>
