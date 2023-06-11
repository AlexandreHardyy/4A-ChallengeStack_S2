<script setup>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const { handleSubmit, handleReset } = useForm({
  validationSchema: yup.object({
    email: yup.string().required().email(),
  }),
});

const email = useField("email");
const password = useField("password");
const showPassword = ref(false);

const submit = handleSubmit((values) => {
  //alert(JSON.stringify(values, null, 2));
  navigateTo("/back/dashboard");
});
</script>

<template>
  <div class="tw-h-screen tw-flex tw-flex-col tw-items-center tw-p-10">
    <h1 class="tw-text-4xl tw-font-bold tw-mb-12">LOGIN</h1>
    <form
      class="tw-w-6/12 tw-flex tw-flex-col tw-gap-3"
      @submit.prevent="submit"
    >
      <v-text-field
        v-model="email.value.value"
        :append-inner-icon="'mdi-email'"
        :error-messages="email.errorMessage.value"
        label="Email"
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
      <v-btn type="submit" variant="outlined" rounded="xl" block class="mt-2"
        >Submit</v-btn
      >
    </form>
  </div>
</template>

<style scoped></style>
