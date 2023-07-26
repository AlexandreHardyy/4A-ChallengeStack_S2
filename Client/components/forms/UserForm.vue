<script setup>

import {useField, useForm} from "vee-validate";
import * as yup from "yup";

const { initUser, title, formMessage } = defineProps(['initUser', 'title', 'formMessage'])

const emit = defineEmits(['submit'])

const {handleSubmit} = useForm({
  validationSchema: yup.object({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().optional().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*\.])/),
    confirmPassword: yup
        .string()
        .optional()
        .oneOf([yup.ref("password"), null], "Passwords must match"),
  }),
});

const firstname = useField("firstname");
const lastname = useField("lastname");
const email = useField("email");
const password = useField("password");
const confirmPassword = useField("confirmPassword");

onMounted(() => {
    if (initUser) {
        firstname.setValue(initUser.firstname)
        lastname.setValue(initUser.lastname)
        email.setValue(initUser.email)
    }
})

const submit = handleSubmit((values) => {
    emit('submit', values)
});

</script>

<template>
    <form
        @submit.prevent="submit"
        class="tw-flex tw-flex-col tw-gap-3 tw-grow">
        <h1 class="tw-text-4xl tw-font-bold tw-mb-12" > {{ title ?? "Profile" }} </h1>
        <div class="tw-flex tw-flex-col tw-gap-1">
            <label for="username">Firstname</label>
            <InputText v-model="firstname.value.value"/>
            <small class="p-error" id="text-error">{{ firstname.errorMessage.value || '&nbsp;' }}</small>
        </div>
        <div class="tw-flex tw-flex-col tw-gap-1">
            <label for="username">Lastname</label>
            <InputText v-model="lastname.value.value"/>
            <small class="p-error" id="text-error">{{ lastname.errorMessage.value || '&nbsp;' }}</small>
        </div>
        <div class="tw-flex tw-flex-col tw-gap-1">
            <label for="username">Email</label>
            <InputText v-model="email.value.value"/>
            <small class="p-error" id="text-error">{{ email.errorMessage.value || '&nbsp;' }}</small>
        </div>
        <div class="tw-flex tw-flex-col tw-gap-1">
            <label for="username">Password</label>
            <Password
                v-model="password.value.value"
                toggleMask
            />
            <small class="p-error" id="text-error">{{ password.errorMessage.value || '&nbsp;' }}</small>
        </div>
        <div class="tw-flex tw-flex-col tw-gap-1">
            <label for="username">Confirm password</label>
            <Password
                v-model="confirmPassword.value.value"
                toogleMask
                :feedback="false"
            />
            <small class="p-error" id="text-error">{{ confirmPassword.errorMessage.value || '&nbsp;' }}</small>
        </div>
        <Button type="submit" outlined class="mt-2">
            {{ initUser ? "Update Profile" : "Add User" }}
        </Button>
        <small :class="formMessage?.type ? 'p-error' : 'p-success'" id="text-error">{{ formMessage?.val || '&nbsp;' }}</small>
    </form>
</template>

<style scoped>
</style>
