<script setup>
import { ref } from 'vue';
import {FilterMatchMode} from "primevue/api";

definePageMeta({
  layout: "back",
});

const transactionHeaders = ref([
  {
    name: 'Name',
    align: 'start',
    sortable: false,
    key: 'name',
  },
  { name: 'Email', key: 'email', align: 'end' },
  { name: 'Bank Code 1', key: 'bankCode1', align: 'end' },
  { name: 'Bank Code 2', key: 'bankCode2', align: 'end' },
  { name: 'Amount', key: 'amount', align: 'end' },
  { name: 'Currency', key: 'currency', align: 'end' },
  {
    name: 'Status',
    key: 'status',
    align: 'end',
    sortable: false,
  },
  {
    name: 'Created At',
    key: 'createdAt',
    align: 'end',
    sortable: false,
  },
  {
    name: 'Updated At',
    key: 'updatedAt',
    align: 'end',
    sortable: false,
  }
]);

const transactionDatas = [
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    bankCode1: "BRI",
    bankCode2: "BNI",
    amount: 100000,
    currency: "EUR",
    status: "Validated",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
  },
  {
    name: "Jane Doe",
    email: "johndoe@gmail.com",
    bankCode1: "BRI",
    bankCode2: "BNI",
    amount: 100000,
    currency: "EUR",
    status: "Pending",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    bankCode1: "BRI",
    bankCode2: "BNI",
    amount: 100000,
    currency: "EUR",
    status: "Rejected",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    bankCode1: "BRI",
    bankCode2: "BNI",
    amount: 100000,
    currency: "EUR",
    status: "Rejected",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    bankCode1: "BRI",
    bankCode2: "BNI",
    amount: 100000,
    currency: "EUR",
    status: "Validated",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    bankCode1: "BRI",
    bankCode2: "BNI",
    amount: 100000,
    currency: "EUR",
    status: "Rejected",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    bankCode1: "BRI",
    bankCode2: "BNI",
    amount: 100000,
    currency: "EUR",
    status: "Validated",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    bankCode1: "BRI",
    bankCode2: "BNI",
    amount: 100000,
    currency: "EUR",
    status: "Pending",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    bankCode1: "BRI",
    bankCode2: "BNI",
    amount: 100000,
    currency: "EUR",
    status: "Pending",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    bankCode1: "BRI",
    bankCode2: "BNI",
    amount: 100000,
    currency: "EUR",
    status: "Validated",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    bankCode1: "BRI",
    bankCode2: "BNI",
    amount: 100000,
    currency: "EUR",
    status: "Pending",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    bankCode1: "BRI",
    bankCode2: "BNI",
    amount: 100000,
    currency: "EUR",
    status: "Pending",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    bankCode1: "BRI",
    bankCode2: "BNI",
    amount: 100000,
    currency: "EUR",
    status: "Rejected",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    bankCode1: "BRI",
    bankCode2: "BNI",
    amount: 100000,
    currency: "EUR",
    status: "Pending",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
  },
];

const getSeverity = (data) => {
  switch (data.status) {
    case 'Validated':
      return 'success';

    case 'Pending':
      return 'warning';

    case 'Rejected':
      return 'danger';

    default:
      return null;
  }
};

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

</script>

<template>
  <div class="card">
    <DataTable :value="transactionDatas"
               tableStyle="min-width: 50rem"
               removableSort
               paginator
               :rows="15"
               :rowsPerPageOptions="[15, 25, 50]"
               scrollable
               scrollHeight="77vh"
               v-model:filters="filters"
               :globalFilterFields="['name', 'currency', 'status']"
    >
      <template #header>
        <div class="flex justify-content-end">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </span>
        </div>
      </template>
      <Column field="name" header="Name" sortable/>
      <Column field="email" header="Email" sortable/>
      <Column field="bankCode1" header="Bank Code 1" sortable/>
      <Column field="bankCode2" header="Bank Code 2" sortable/>
      <Column field="amount" header="Amount" sortable/>
      <Column field="currency" header="Currency" sortable/>
      <Column header="Status" sortable>
        <template #body="slotProps">
          <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data)"/>
        </template>
      </Column>
      <Column field="createdAt" header="Created At" sortable/>
      <Column field="updatedAt" header="Updated At" sortable/>
    </DataTable>
  </div>
</template>

<style scoped></style>
