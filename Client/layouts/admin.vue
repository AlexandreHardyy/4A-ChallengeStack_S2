<script setup>
import userService from '~/services/user';
</script>

<template>
  <div class="tw-flex tw-min-h-screen">
    <nav
        class="nav tw-w-52 tw-h-screen tw-flex tw-flex-col tw-items-center tw-justify-between tw-p-8 tw-text-background"
    >
      <img src="~/assets/logo_black.png" class="tw-h-20" alt="logo"/>
      <div class="tw-flex tw-flex-col">
        <nuxt-link class="btn" :to="{ path: '/admin/profile' }">
          Profile
        </nuxt-link>
        <nuxt-link class="btn" :to="{ path: '/admin' }">
          Dashboard
        </nuxt-link>
        <nuxt-link class="btn" :to="{ path: '/admin/company' }">
          Companies
        </nuxt-link>
        <nuxt-link class="btn" :to="{ path: '/admin/transaction' }">
          Transactions
        </nuxt-link>
      </div>
      <nuxt-link :to="{ path: '/login' }">
        <Button severity="secondary" @click="userService.logout()">Disconnect</Button>
      </nuxt-link>
    </nav>
    <div class="tw-p-6 tw-w-full tw-h-screen tw-overflow-scroll">
      <slot/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
nav {
  background-color: #ffe47a;
}

.btn {
  padding: 5px 15px;
  cursor: pointer;
  transition: all 0.1s;
  font-size: 1.2rem;
  font-weight: bold;
  border-left: 4px solid transparent;
  margin-bottom: 10px;

  &:hover {
    border-color: theme("colors.background");
  }
}

.router-link-active {
  border-left: 4px solid theme("colors.background");
}
</style>
