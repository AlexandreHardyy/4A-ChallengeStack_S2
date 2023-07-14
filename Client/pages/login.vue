<script setup>
import {useField, useForm} from "vee-validate";
import * as yup from "yup";
import userService from "@/services/user";
import { useUserStore } from "@/store/user";

const formatErrorPassword = (err) => {
  return err?.includes('password must match') ? 'required: 1 maj, 1 min, 1 number and 1 character special' : err
}

const {handleSubmit, handleReset} = useForm({
  validationSchema: yup.object({
    email: yup.string().required().email(),
    password: yup.string().required()
  }),
});

const email = useField("email");
const password = useField("password");
const loginError = ref(null);
const { setToken } = useUserStore()

const submit = handleSubmit(async (values) => {
  const { error, data } = await userService.login(values)
  if (error.value !== null || !data.value?.token) {
    loginError.value = "email or password is not correct"
    return
  }
  setToken(data.value.token)
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
        <InputText v-model="email.value.value" @focus="loginError = null" />
        <small class="p-error" id="text-error">{{ email.errorMessage.value || '&nbsp;' }}</small>
      </div>
      <div class="tw-flex tw-flex-col tw-gap-1">
        <label for="username">Password</label>
        <Password
            v-model="password.value.value"
            toggleMask
            :feedback="false"
            @focus="loginError = null"
        />
        <small class="p-error" id="text-error">{{ formatErrorPassword(password.errorMessage.value) || '&nbsp;' }}</small>
      </div> 
      <Button type="submit" outlined class="tw-mt-2">Submit</Button>

      <small class="p-error" id="text-error">{{ loginError || '&nbsp;' }}</small>

    </form>
  </div>
</template>

<style scoped></style>
