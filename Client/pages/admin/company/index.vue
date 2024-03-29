<script setup>
import {useCustomFetch} from "~/services/use-fetch";
import {useDialog} from "primevue/usedialog";
import useFormatDate from "../../../services/format/useFormatDate";
import {ref} from "vue";
import {FilterMatchMode} from "primevue/api";

definePageMeta({
  layout: "admin",
});

const dialog = useDialog();
const companies = ref();
const isChecked = ref(false);

const getData = async () => {
  const res = await useCustomFetch("user" + (isChecked.value ? "?isValid=false" : ""));
  companies.value = res.data.value.filter((item) => item.companyId);
};

onMounted(async () => {
  await getData();
});

watch(isChecked, async () => {
  await getData();
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

</script>

<template>
  <div class="card">
    <DataTable 
      :value="companies"
      tableStyle="min-width: 50rem"
      removableSort
      paginator
      :rows="15"
      :rowsPerPageOptions="[15, 25, 50]"
      scrollable
      scrollHeight="flex"
      v-model:filters="filters"
      :globalFilterFields="['name', 'email']"
    >
      <template #header>
        <div class="tw-flex tw-justify-around tw-items-center">
          <div class="flex justify-content-end">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
            </span>
          </div>
          <div class="tw-flex tw-align-middle tw-gap-3">
            <label>Only show the disable companies</label>
            <InputSwitch v-model="isChecked" />
          </div>
        </div>
      </template>
      <Column field="id" header="ID" sortable/>
      <Column field="email" header="Email" sortable/>
      <Column header="Company name" sortable>
        <template #body="slotProps">
          <span>{{ slotProps.data.Company.name }}</span>
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
      <Column field="isValid" header="Validated" sortable>
        <template #body="slotProps">
          <Tag v-if="slotProps.data.isValid">Yes</Tag>
          <Tag v-else severity="warning">No</Tag>
        </template>
      </Column>
      <Column header="Action" >
        <template #body="slotProps">
          <div class="tw-flex tw-gap-3">
            <nuxt-link :to="{ path: `/admin/company/${slotProps.data.id}`}">
              <Button v-tooltip.bottom="'Details'" type="button" class="tw-mr-2">
                <i class="pi pi-cog"/>
              </Button>
            </nuxt-link>
            <Button v-tooltip.bottom="'Delete user'" type="button" class="tw-mr-2" severity="danger">
              <i class="pi pi-trash"/>
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.card {
  height: 100%;
}
</style>
