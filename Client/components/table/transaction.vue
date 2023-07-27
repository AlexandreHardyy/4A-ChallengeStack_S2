<script setup>
import { ref } from 'vue';
import {FilterMatchMode} from "primevue/api";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import useFormatDate from "../../services/format/useFormatDate";

const toast = useToast();
const confirm = useConfirm();
const route = useRoute()

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
      :globalFilterFields="['name', 'email', 'currency', 'status']"
    >
      <template #header>
        <div class="flex justify-content-end">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </span>
        </div>
      </template>
      <Column v-if="route.path.includes('admin')" header="Company name" sortable>
        <template #body="slotProps">
            <span>{{ slotProps.data.company.name }}</span>
        </template>
      </Column>
      <Column field="name" header="Name" sortable/>
      <Column field="email" header="Email" sortable/>
      <Column field="amount" header="Amount" sortable/>
      <Column field="currency" header="Currency" sortable/>
      <Column header="Status" sortable>
        <template #body="slotProps">
          <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data)"/>
        </template>
      </Column>
      <Column field="createdAt" header="Created At" sortable>
        <template #body="slotProps">
          <span>{{ useFormatDate(slotProps.data.createdAt) }}</span>
        </template>
      </Column>
      <Column field="updatedAt" header="Updated At" sortable>
        <template #body="slotProps">
          <span>{{ useFormatDate(slotProps.data.updatedAt) }}</span>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <div class="tw-flex tw-gap-2">
            <nuxt-link :to="{ path: `/${route.path.includes('admin') ? 'admin' : 'back'}/transaction/${slotProps.data.id}`}">
              <Button  v-tooltip.bottom="'Show is view'" type="button" class="tw-mr-2" severity="info">
                <i class="pi pi-eye"/>
              </Button>
            </nuxt-link>
            <nuxt-link v-if="route.path.includes('admin')" :to="{ path: `/admin/company/${slotProps.data.company.id}`}">
              <Button  v-tooltip.bottom="'Show company'" type="button" class="tw-mr-2" severity="info">
                <i class="pi pi-briefcase"/>
              </Button>
            </nuxt-link>
          </div>
        </template>
      </Column>
    </DataTable>
</template>

<style scoped>
.card{
  height: 100%;
}
</style>
