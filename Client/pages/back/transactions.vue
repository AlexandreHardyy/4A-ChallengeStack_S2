<script setup>
import { ref } from 'vue';
import {FilterMatchMode} from "primevue/api";
import transactionService from '~/services/transaction';
import { useUserStore } from '~/store/user';

const { user } = useUserStore()

definePageMeta({
  layout: "back",
});

const transactions = reactive([])

onMounted( async () => {
  const { data } = await transactionService.getByComanyId(user.company.id)
  transactions.value = data.value
})

const getSeverity = (transaction) => {
  switch (transaction.operations[0].status) {
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
    <DataTable
    v-if="transactions.length !== 0"
      :value="transactions"             
      tableStyle="min-width: 50rem"
      removableSort
      paginator
      :rows="15"
      :rowsPerPageOptions="[15, 25, 50]"
      scrollable
      crollHeight="77vh"
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
    </DataTable>
    <div v-else>
      <h1 class="tw-text-4xl tw-font-bold tw-mb-12">There is no transactions yet ..</h1>
    </div>
  </div>
</template>

<style scoped></style>
