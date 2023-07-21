<script setup>
import {useCustomFetch} from "~/services/use-fetch";
import {useDialog} from "primevue/usedialog";
import MerchantDetails from "~/components/merchants/MerchantDetails.vue";
import useFormatDate from "../../../services/format/useFormatDate";
definePageMeta({
  layout: "admin",
});

const dialog = useDialog();
const merchants = ref();

onMounted(async () => {
  const res = await useCustomFetch("user");
  merchants.value = res.data.value;
});

const showMerchantDetails = (id) => {
  const dialogRef = dialog.open(MerchantDetails, {
    props: {
      header: 'Merchant Details',
      style: {
        width: '50vw',
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      modal: true
    },
    data: {
      id
    },
  });
}
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
               scrollHeight="flex"
               :globalFilterFields="['name', 'currency', 'status']"
    >
      <Column field="id" header="ID" sortable/>
      <Column field="email" header="Email" sortable/>
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
      <Column header="Action" >
        <template #body="slotProps">
          <div class="tw-flex tw-gap-3">
            <nuxt-link :to="{ path: '/back/dashboard'}">
              <Button  v-tooltip.bottom="'Show is view'" type="button" class="tw-mr-2" severity="info">
                <i class="pi pi-eye"/>
              </Button>
            </nuxt-link>
            <Button v-tooltip.bottom="'Delete user'" type="button" class="tw-mr-2" severity="danger">
              <i class="pi pi-trash"/>
            </Button>
            <Button v-if="!slotProps.data.isVerified" @click="showMerchantDetails(slotProps.data.id)" type="button" class="tw-mr-2" severity="Validate">
              <i class="pi pi-verified"/>
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
