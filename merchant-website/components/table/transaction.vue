<script setup>
import { ref } from 'vue';
import { FilterMatchMode } from "primevue/api";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const config = useRuntimeConfig();
const toast = useToast();
const confirm = useConfirm();
let refundAmount = ref();

const showRefundDialog = (token) => {
  confirm.require({
    group: 'refundDialog',
    header: 'Refund',
    message: 'How much do you want to refund?',
    icon: 'pi pi-undo',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    accept: () => {
      fetch(`${config.public.apiBaseServerMerchant}/transaction/${token}/refund`,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({amount: refundAmount.value})
          }
      );
      toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Refund', life: 3000 });
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'Cancel refund', life: 3000 });
    }
  });
};

defineProps(['transactions'])

const getSeverity = (transaction) => {
  switch (transaction) {
    case 'created':
      return 'secondary';
    case 'canceled':
      return 'warning';
    case 'captured':
      return 'success';
    case 'partially-refunded':
      return 'info';
    case 'refunded':
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
          <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)"/>
        </template>
      </Column>
      <Column field="createdAt" header="Created At" sortable/>
      <Column field="updatedAt" header="Updated At" sortable/>
      <Column header="Actions">
        <template #body="slotProps">
          <Button @click="showRefundDialog(slotProps.data.token)" v-if="slotProps.data.status === 'captured' || slotProps.data.status === 'partially-refunded'" class="mr-2">Refund</Button>
          <div v-else>no action available</div>
        </template>
      </Column>
      <ConfirmDialog group="refundDialog">
        <template #message="slotProps">
          <div class="flex p-4 flexPopUp">
            <i :class="slotProps.message.icon" style="font-size: 1.5rem"></i>
            <p class="pl-2">{{ slotProps.message.message }}</p>
            <InputNumber v-model="refundAmount" inputId="refundAmount" :min="0"/>
          </div>
        </template>
      </ConfirmDialog>
    </DataTable>
</template>

<style scoped>
.card{
  height: 100%;
}

.flexPopUp{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}
</style>
