<script setup>
import { ref } from 'vue';
import {FilterMatchMode} from "primevue/api";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";


definePageMeta({
  layout: "back",
});

const toast = useToast();
const confirm = useConfirm();

const confirmRefund = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Are you sure you want to refund?',
    icon: 'pi pi-replay',
    accept: () => {
      //TODO: call api to refund transaction
      toast.add({ severity: 'info', summary: 'Confirm', detail: 'Refund', life: 3000 });
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Cancel', detail: 'Cancel refund', life: 3000 });
    }
  });
};

const transactionHeaders = ref([
  {
    name: 'Name',
    align: 'start',
    sortable: false,
    key: 'name',
  },
  { name: 'Email', key: 'email', align: 'end' },
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
  },
  {
    name: 'Actions',
    key: 'actions',
    align: 'end',
    sortable: false,
  }
]);

const transactionDatas = [
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    amount: 100000,
    currency: "EUR",
    status: "confirm",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
    action: "refund"
  },
  {
    name: "Jane Doe",
    email: "johndoe@gmail.com",
    amount: 100000,
    currency: "EUR",
    status: "refund",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
    action: "refund"
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    amount: 100000,
    currency: "EUR",
    status: "cancel",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
    action: "refund"
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    amount: 100000,
    currency: "EUR",
    status: "cancel",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
    action: "refund"
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    amount: 100000,
    currency: "EUR",
    status: "confirm",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
    action: "refund"
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    amount: 100000,
    currency: "EUR",
    status: "cancel",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
    action: "refund"
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    amount: 100000,
    currency: "EUR",
    status: "confirm",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
    action: "refund"
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    amount: 100000,
    currency: "EUR",
    status: "refund",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
    action: "refund"
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    amount: 100000,
    currency: "EUR",
    status: "refund",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
    action: "refund"
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    amount: 100000,
    currency: "EUR",
    status: "confirm",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
    action: "refund"
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    amount: 100000,
    currency: "EUR",
    status: "refund",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
    action: "refund"
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    amount: 100000,
    currency: "EUR",
    status: "refund",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
    action: "refund"
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    amount: 100000,
    currency: "EUR",
    status: "cancel",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
    action: "refund"
  },
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    amount: 100000,
    currency: "EUR",
    status: "refund",
    createdAt: "2021-08-01",
    updatedAt: "2021-08-01",
    action: "refund"
  },
];

const getSeverity = (data) => {
  switch (data.status) {
    case 'confirm':
      return 'success';

    case 'refund':
      return 'secondary';

    case 'cancel':
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
               scrollHeight="flex"
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
      <Column field="amount" header="Amount" sortable/>
      <Column field="currency" header="Currency" sortable/>
      <Column header="Status" sortable>
        <template #body="slotProps">
          <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data)"/>
        </template>
      </Column>
      <Column field="createdAt" header="Created At" sortable/>
      <Column field="updatedAt" header="Updated At" sortable/>
      <Column header="Actions">
        <template #body="slotProps">
<!--          <Button :label="slotProps.data.action" class="p-button-rounded p-button-primary"/>-->
          <Button v-if="slotProps.data.status === 'confirm'" @click="confirmRefund($event)" icon="pi pi-" :label="slotProps.data.action"></Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.card{
  height: 100%;
}
</style>
