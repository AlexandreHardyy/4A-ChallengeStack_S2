<script setup>
import { ref } from 'vue';
import {FilterMatchMode} from "primevue/api";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

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

defineProps(['transactions'])


const getSeverity = (transaction) => {
  switch (transaction.status) {
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
    <DataTable
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
          <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data)"/>
        </template>
      </Column>
      <Column field="createdAt" header="Created At" sortable/>
      <Column field="updatedAt" header="Updated At" sortable/>
      <Column header="Actions">
        <template #body="slotProps">
          <Button v-if="slotProps.data.status === 'confirm'" @click="confirmRefund($event)" icon="pi pi-" :label="slotProps.data.action"></Button>
          <div>no action availables </div>
        </template>
      </Column>
    </DataTable>
</template>

<style scoped>
.card{
  height: 100%;
}
</style>
