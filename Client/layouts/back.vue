<script lang="ts" setup>
const selected = ref(1);
</script>

<template>
  <div class="tw-flex tw-min-h-screen">
    <nav
        class="tw-bg-primary-light tw-w-52 tw-h-screen tw-flex tw-flex-col tw-items-center tw-justify-between tw-p-8 tw-text-background"
    >
      <img src="~/assets/logo_black.png" class="tw-h-20" alt="logo"/>
      <ul>
        <nuxt-link :to="{ path: '/back/dashboard' }">
          <li @click="selected = 1" class="btn" :class="{ active: selected == 1 }">Dashboard</li>
        </nuxt-link>
        <nuxt-link :to="{ path: '/back/transactions' }">
          <li @click="selected = 2" class="btn" :class="{ active: selected == 2 }">Transactions</li>
        </nuxt-link>
      </ul>
      <nuxt-link :to="{ path: '/login' }">
        <Button severity="secondary">Disconnect</Button>
      </nuxt-link>
    </nav>
    <div class="tw-p-6 tw-w-full tw-h-screen tw-overflow-scroll">
      <slot/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

.active {
  border-left: 4px solid theme("colors.background");
}
</style>
