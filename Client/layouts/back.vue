<script lang="ts" setup></script>

<template>
  <div class="tw-flex tw-min-h-screen">
    <nav
      class="tw-bg-primary-light tw-w-52 tw-flex tw-flex-col tw-items-center tw-justify-between tw-p-8 tw-text-background"
    >
      <img src="~/assets/logo_black.png" class="tw-h-20" alt="logo" />
      <ul>
        <nuxt-link :to="{ path: '/back/dashboard' }">
          <li class="btn">Dashboard</li>
        </nuxt-link>
        <nuxt-link :to="{ path: '/back/transactions' }">
          <li class="btn">Transactions</li>
        </nuxt-link>
      </ul>
      <nuxt-link :to="{ path: '/login' }">
        <v-btn prepend-icon="mdi-power">Disconnect</v-btn>
      </nuxt-link>
    </nav>
    <div class="tw-p-6">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  padding: 5px 15px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.1s;
  font-size: 1.2rem;
  font-weight: bold;
  border: 3px solid transparent;
  &:hover {
    border-color: theme("colors.background");
  }
}
</style>
