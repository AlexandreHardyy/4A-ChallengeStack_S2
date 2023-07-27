<script setup>
import userService from '~/services/user';
import useFormatDate from "../../services/format/useFormatDate";

definePageMeta({
  layout: "admin",
});

const users = ref([])

const visible = ref(false)
const deleteId = ref(null)

onMounted(async () => {
    await getUser()
})

const getUser = async () => {
    const { data } = await userService.get({ admin: true })
    if (data.value) {
        users.value = data.value
    }
}

const displayPopUp = (id) => {
  visible.value = true
  deleteId.value = id
}

const removeUser = async () => {
  await userService.remove(deleteId.value)
  await getUser()
  visible.value = false
  deleteId.value = null
}

</script>

<template>
<div>
    <h1 class="tw-text-4xl tw-font-bold tw-mb-12" > Admin Users </h1>
<DataTable
      :value="users"             
      tableStyle="min-width: 50rem"
      removableSort
      paginator
      :rows="15"
      :rowsPerPageOptions="[15, 25, 50]"
      scrollable
      scrollHeight="flex"
    >
      <Column field="firstname" header="Firstname" sortable/>
      <Column field="lastname" header="Lastname" sortable/>
      <Column field="email" header="Email" sortable/>
      <Column field="createdAt" header="Created At" sortable>
        <template #body="slotProps">
          <span>{{ useFormatDate(slotProps.data.createdAt) }}</span>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <div class="tw-flex tw-gap-2">
              <Button @click="() => displayPopUp(slotProps.data.id)" v-tooltip.bottom="'Delete this account'" type="button" class="tw-mr-2" severity="danger">
                <i class="pi pi-trash"/>
              </Button>
          </div>
        </template>
      </Column>    
    </DataTable>
    <Dialog v-model:visible="visible" modal header="Header" :style="{ width: '50vw' }">
      <p>
          Delete this admin user ?
      </p>
      <template #footer>
          <Button label="Cancel" icon="pi pi-times" @click="visible = false" text />
          <Button pr label="Yes" icon="pi pi-check" @click="removeUser()" autofocus severity="danger" />
      </template>
    </Dialog>
</div>
</template>

<style scoped>

.danger-info {
  background-color: #ff9b9b;
  font-size: 12px;
  margin-top: 5px;
  border: 1px solid #ff4c4e;
  color: black;
  padding: 5px;
  border-radius: 5px;
}

</style>
