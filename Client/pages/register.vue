<script setup>
import {useField, useForm} from "vee-validate";
import * as yup from "yup";

const {handleSubmit, handleReset} = useForm({
  validationSchema: yup.object({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    companyName: yup.string().required(),
    kbis: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required().min(8),
    confirmPassword: yup
        .string()
        .required()
        .oneOf([yup.ref("password"), null], "Passwords must match"),
  }),
});

const firstname = useField("firstname");
const lastname = useField("lastname");
const companyName = useField("companyName");
const kbis = useField("kbis");
const email = useField("email");
const password = useField("password");
const confirmPassword = useField("confirmPassword");

const submit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
});
</script>

<template>
  <div class="tw-min-h-screen tw-flex tw-flex-col tw-items-center tw-p-10">
    <h1 class="tw-text-4xl tw-font-bold tw-mb-12">REGISTER</h1>
    <form
        @submit.prevent="submit"
        class="tw-w-6/12 tw-flex tw-flex-col tw-gap-3"
    >
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
      <Button type="submit" outlined class="mt-2"
      >Submit
      </Button>
    </form>
  </div>
</template>

<style scoped></style>
