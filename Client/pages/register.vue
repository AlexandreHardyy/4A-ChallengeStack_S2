<script setup>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const { handleSubmit, handleReset } = useForm({
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
const showPassword = ref(false);

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
      <v-text-field
        v-model="firstname.value.value"
        :append-inner-icon="'mdi-emoticon'"
        :error-messages="firstname.errorMessage.value"
        label="Firstname"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        v-model="lastname.value.value"
        :append-inner-icon="'mdi-emoticon'"
        :error-messages="lastname.errorMessage.value"
        label="Lastname"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        v-model="email.value.value"
        :append-inner-icon="'mdi-email'"
        :error-messages="email.errorMessage.value"
        label="Email"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        v-model="companyName.value.value"
        :append-inner-icon="'mdi-city'"
        :error-messages="companyName.errorMessage.value"
        label="Company Name"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        v-model="kbis.value.value"
        :append-inner-icon="'mdi-city'"
        :error-messages="kbis.errorMessage.value"
        label="KBIS"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        v-model="password.value.value"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :error-messages="password.errorMessage.value"
        :type="showPassword ? 'text' : 'password'"
        name="input-10-1"
        label="Password"
        variant="outlined"
        @click:append-inner="showPassword = !showPassword"
      ></v-text-field>
      <v-text-field
        v-model="confirmPassword.value.value"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :error-messages="confirmPassword.errorMessage.value"
        :type="showPassword ? 'text' : 'password'"
        name="input-10-1"
        label="Confirm password"
        variant="outlined"
        @click:append-inner="showPassword = !showPassword"
      ></v-text-field>
      <v-btn type="submit" variant="outlined" rounded="xl" block class="mt-2"
        >Submit</v-btn
      >
    </form>
  </div>
</template>

<style scoped></style>
