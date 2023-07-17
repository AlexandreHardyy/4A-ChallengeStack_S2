<script setup>
import {useCustomFetch} from "~/services/use-fetch";
definePageMeta({
  layout: "admin",
});

const merchants = ref();

onMounted(async () => {
  const res = await useCustomFetch("user");
  merchants.value = res.data.value;
});
</script>

<template>
  <div class="card">
    <DataTable :value="merchants"
               tableStyle="min-width: 50rem"
               removableSort
               paginator
               :rows="15"
               :rowsPerPageOptions="[15, 25, 50]"
               scrollable
               scrollHeight="77vh"
               :globalFilterFields="['name', 'currency', 'status']"
    >
      <Column field="id" header="ID" sortable/>
      <Column field="email" header="Email" sortable/>
      <Column field="createdAt" header="Created At" sortable>
        <template #body="slotProps">
          <span>{{ new Date(slotProps.data.createdAt).toLocaleDateString() }}</span>
        </template>
      </Column>
      <Column field="updatedAt" header="Updated At" sortable>
        <template #body="slotProps">
          <span>{{ new Date(slotProps.data.updatedAt).toLocaleDateString() }}</span>
        </template>
      </Column>
      <Column header="Action" >
        <template #body="slotProps">
          <div class="tw-flex tw-gap-3">
            <Button type="button" class="tw-mr-2" severity="info">
              <nuxt-link :to="{ path: '/back/dashboard'}">
                <i class="pi pi-eye"/>
              </nuxt-link>
            </Button>
            <Button type="button" class="tw-mr-2" severity="danger">
              <i class="pi pi-trash"/>
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped></style>
