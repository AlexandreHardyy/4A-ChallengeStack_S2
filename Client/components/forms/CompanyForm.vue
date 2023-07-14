<script setup>

import {useField, useForm} from "vee-validate";
import * as yup from "yup";

const { company } = defineProps(['company'])

const emit = defineEmits(['submit'])

const {handleSubmit} = useForm({
  validationSchema: yup.object({
    kbis: yup.string().required(),
    name: yup.string().required(),
    address: yup.string(),
  }),
});

const kbis = useField("kbis");
const companyName = useField("name");
const address = useField("address");

const submit = handleSubmit((values) => {
    emit('submit', values)
});

onMounted(() => {
    kbis.setValue(company.kbis ?? "")
    address.setValue(company.address ?? "")
    companyName.setValue(company.name ?? "")
})

</script>

<template>
    <form
        @submit.prevent="submit"
        class="tw-flex tw-flex-col tw-gap-3 tw-grow">
        <h1 class="tw-text-4xl tw-font-bold tw-mb-12">Company</h1>
        <div class="tw-flex tw-flex-col tw-gap-1">
            <label for="username">Company Name</label>
            <InputText v-model="companyName.value.value"/>
            <small class="p-error" id="text-error">{{ companyName.errorMessage.value || '&nbsp;' }}</small>
        </div>
        <div class="tw-flex tw-flex-col tw-gap-1">
            <label for="username">KBIS</label>
            <InputText v-model="kbis.value.value"/>
            <small class="p-error" id="text-error">{{ kbis.errorMessage.value || '&nbsp;' }}</small>
        </div>
        <div class="tw-flex tw-flex-col tw-gap-1">
            <label for="username">Address</label>
            <InputText v-model="address.value.value"/>
            <small class="p-error" id="text-error">{{ address.errorMessage.value || '&nbsp;' }}</small>
        </div>
        <Button type="submit" outlined class="mt-2">
            Update Company
        </Button>
    </form>
</template>

<style scoped>
</style>
