<script setup>
import {useField, useForm} from "vee-validate";
import * as yup from "yup";

const {handleSubmit, handleReset} = useForm({
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
            :feedback="false"
        />
        <small class="p-error" id="text-error">{{ password.errorMessage.value || '&nbsp;' }}</small>
      </div>
      <Button type="submit" outlined class="tw-mt-2">Submit</Button>
    </form>
  </div>
</template>

<style scoped></style>
