<script setup>
import { ref } from 'vue';
import {FilterMatchMode} from "primevue/api";
import transactionService from '~/services/transaction';
import { useUserStore } from '~/store/user';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const { user } = useUserStore()

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

const transactions = reactive([])

onMounted( async () => {
  const { data } = await transactionService.getByComanyId(user.company.id)
  transactions.value = data.value
})

const getSeverity = (transaction) => {
  switch (transaction.operations[0].status) {
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
    <DataTable
      v-if="transactions.length !== 0"
      :value="transactions"             
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
          <Tag :value="slotProps.data.operations[0].status" :severity="getSeverity(slotProps.data)"/>
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
    <div v-else>
      <h1 class="tw-text-4xl tw-font-bold tw-mb-12">There is no transactions yet ..</h1>
    </div>
  </div>
</template>

<style scoped>
.card{
  height: 100%;
}
</style>
